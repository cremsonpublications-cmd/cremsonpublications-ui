// Check email delivery status in Brevo
const checkEmailStatus = async () => {
  const BREVO_API_KEY = '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';
  const messageId = '202510090340.10463531267@smtp-relay.mailin.fr'; // Your message ID
  
  try {
    // Get email events/logs
    console.log('Checking email delivery status...');
    
    // Check recent email events
    const eventsResponse = await fetch('https://api.brevo.com/v3/smtp/statistics/events?limit=50&offset=0', {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY
      }
    });
    
    if (eventsResponse.ok) {
      const events = await eventsResponse.json();
      console.log('Recent email events:', JSON.stringify(events, null, 2));
      
      // Look for your specific email
      const yourEmail = events.events?.find(event => 
        event.email === 'arjunanofficial21@gmail.com' || 
        event.messageId?.includes('202510090340')
      );
      
      if (yourEmail) {
        console.log('Found your email event:', yourEmail);
        console.log('Status:', yourEmail.event);
        console.log('Reason:', yourEmail.reason || 'No reason provided');
      } else {
        console.log('Email event not found in recent events');
      }
    } else {
      console.error('Failed to get events:', await eventsResponse.text());
    }
    
    // Check account sending statistics
    console.log('\nChecking account statistics...');
    const statsResponse = await fetch('https://api.brevo.com/v3/smtp/statistics/aggregatedReport?startDate=2025-10-09&endDate=2025-10-09', {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY
      }
    });
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('Today\'s email statistics:', JSON.stringify(stats, null, 2));
    }
    
  } catch (error) {
    console.error('Error checking email status:', error);
  }
};

checkEmailStatus();
