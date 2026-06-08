import express, { Response } from 'express';
import { supabase, AuthRequest } from '../server';
import { findLeadsByLocation } from '../services/apollo';
import { generateColdEmail, parseCV } from '../services/claude';
import { sendBatchEmails } from '../services/resend';

const router = express.Router();

// Create campaign
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { cv_content, target_location, target_role } = req.body;

    if (!cv_content || !target_location || !target_role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: req.user.id,
        cv_content,
        target_location,
        target_role,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('Create campaign error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get campaigns
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Get campaigns error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get campaign by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (err: any) {
    console.error('Get campaign error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Find leads for campaign
router.post('/:id/find-leads', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Find leads via Apollo
    const leads = await findLeadsByLocation({
      location: campaign.target_location,
      role: campaign.target_role,
    });

    // Save leads to database
    const leadsWithCampaignId = leads.map((lead: any) => ({
      campaign_id: id,
      apollo_id: lead.id,
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      email_verified: true,
      company_name: lead.organization_name,
      job_title: lead.title,
      linkedin_url: lead.linkedin_url,
      tech_stack: JSON.stringify(lead.technologies || []),
    }));

    const { data: savedLeads, error: insertError } = await supabase
      .from('leads')
      .insert(leadsWithCampaignId)
      .select();

    if (insertError) throw insertError;

    // Update campaign status
    await supabase
      .from('campaigns')
      .update({ status: 'leads_found', leads_count: savedLeads?.length || 0 })
      .eq('id', id);

    res.json({ leads: savedLeads, count: savedLeads?.length || 0 });
  } catch (err: any) {
    console.error('Find leads error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generate emails for campaign
router.post('/:id/generate-emails', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    // Get campaign and leads
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('campaign_id', id);

    if (!leads || leads.length === 0) {
      return res.status(404).json({ error: 'No leads found' });
    }

    // Parse CV
    const cvData = await parseCV(campaign.cv_content);

    // Generate emails for each lead
    const emails = [];
    for (const lead of leads) {
      try {
        const email = await generateColdEmail({
          candidateName: cvData.name || 'Software Engineer',
          candidateRole: campaign.target_role,
          candidateTechStack: cvData.skills || [],
          candidateExperience: cvData.experience || '',
          leadName: `${lead.first_name} ${lead.last_name}`,
          leadTitle: lead.job_title,
          leadCompany: lead.company_name,
          leadTechStack: JSON.parse(lead.tech_stack || '[]'),
          sharedTechnologies: [],
        });

        const { data: savedEmail } = await supabase
          .from('generated_emails')
          .insert({
            lead_id: lead.id,
            subject: email.subject,
            body: email.body,
            model_used: 'claude-3-5-sonnet-20241022',
          })
          .select()
          .single();

        emails.push(savedEmail);
      } catch (err) {
        console.error(`Failed to generate email for lead ${lead.id}:`, err);
      }
    }

    // Update campaign status
    await supabase
      .from('campaigns')
      .update({ status: 'emails_generated' })
      .eq('id', id);

    res.json({ emails, count: emails.length });
  } catch (err: any) {
    console.error('Generate emails error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send emails for campaign
router.post('/:id/send-emails', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    // Get all generated emails for this campaign
    const { data: emailsToSend } = await supabase
      .from('generated_emails')
      .select('*, leads(*)')
      .eq('leads.campaign_id', id);

    if (!emailsToSend || emailsToSend.length === 0) {
      return res.status(404).json({ error: 'No emails to send' });
    }

    // Send emails via Resend
    const sendPromises = emailsToSend.map(async (email) => {
      const sendResult = await sendBatchEmails([
        {
          to: email.leads.email,
          subject: email.subject,
          body: email.body,
        },
      ]);

      if (sendResult[0].status === 'pending') {
        // Record send in database
        await supabase
          .from('email_sends')
          .insert({
            generated_email_id: email.id,
            resend_message_id: sendResult[0].messageId,
            status: 'pending',
          });
      }

      return sendResult[0];
    });

    const results = await Promise.all(sendPromises);

    // Update campaign status
    const successCount = results.filter((r) => r.status === 'pending').length;
    await supabase
      .from('campaigns')
      .update({ status: 'sent', emails_sent: successCount })
      .eq('id', id);

    res.json({
      sent: successCount,
      failed: results.filter((r) => r.status === 'error').length,
      total: results.length,
    });
  } catch (err: any) {
    console.error('Send emails error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get leads for campaign
router.get('/:id/leads', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('campaign_id', id);

    if (error) throw error;
    res.json(leads);
  } catch (err: any) {
    console.error('Get leads error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get emails for campaign
router.get('/:id/emails', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const { data: emails, error } = await supabase
      .from('generated_emails')
      .select('*, leads(*)')
      .eq('leads.campaign_id', id);

    if (error) throw error;
    res.json(emails);
  } catch (err: any) {
    console.error('Get emails error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
