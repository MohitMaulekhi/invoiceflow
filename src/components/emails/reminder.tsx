import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text } from "@react-email/components";

interface ReminderEmailProps {
  senderName: string;
  customerName: string;
  invoiceDescription: string;
  amountFormatted: string;
  dueDateFormatted: string;
}

export default function ReminderEmail({
  senderName,
  customerName,
  invoiceDescription,
  amountFormatted,
  dueDateFormatted,
}: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment Reminder from {senderName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{senderName}</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            This is a friendly reminder from <strong>{senderName}</strong> regarding your recent invoice for <strong>{invoiceDescription}</strong>. The payment is due on <strong>{dueDateFormatted}</strong>.
          </Text>
          <Section style={section}>
            <Text style={amountText}>Amount Due: {amountFormatted}</Text>
          </Section>
          <Text style={text}>
            Please process this payment at your earliest convenience. If you have already paid, please disregard this email.
          </Text>
          <Text style={text}>
            <em>Please find the official PDF copy of your invoice attached to this email.</em>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Thank you for your business!
            <br />
            {senderName}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "5px",
};

const section = {
  padding: "24px",
  backgroundColor: "#f9fafb",
  borderRadius: "4px",
  margin: "24px 0",
};

const h1 = {
  color: "#0d9488",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
  padding: "0 24px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 24px",
};

const amountText = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 24px",
};
