import axios from 'axios';

export async function sendDiscordNotification(webhookUrl: string, message: string, embeds: any[] = []) {
    if (!webhookUrl) return;

    try {
        await axios.post(webhookUrl, {
            content: message,
            embeds: embeds,
        });
    } catch (error) {
        console.error('Failed to send Discord notification:', error);
    }
}
