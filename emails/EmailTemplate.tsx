import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Image from "next/image";

interface EmailTemplateProps {
  previewText: string;
  header: string;
  body: string[];
  buttonText: string;
  buttonUrl: string;
  footer: string;
}

const EmailTemplate = ({
  previewText,
  header,
  body,
  buttonText,
  buttonUrl,
  footer,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#111624] my-auto mx-auto font-ibm-plex-sans">
          <Container className="my-10 mx-8 p-5 w-[600px]">
            <Section className="border-b border-dashed border-[#232839] pb-7">
              <Row>
                <Column width="47">
                  <Image
                    src="/static/logo.svg"
                    alt="logo"
                    width={40}
                    height={32}
                  />
                </Column>
                <Column>
                  <Text className="text-[28px] text-white font-ibm-plex-sans font-semibold">
                    BookWise
                  </Text>
                </Column>
              </Row>
            </Section>
            <Heading className="text-2xl text-white font-ibm-plex-sans font-bold mt-10 whitespace-pre-line">
              {header}
            </Heading>
            {body.map((item) => (
              <Text className="text-lg text-white font-ibm-plex-sans font-light my-7 whitespace-pre-line">
                {item}
              </Text>
            ))}
            <Section className="text-start my-2">
              <Button
                className="bg-[#e7c9a5] text-[#111624] inline-flex h-[46px] w-[177px] items-center justify-center rounded-md font-ibm-plex-sans font-semibold text-base"
                href={buttonUrl}
              >
                {buttonText}
              </Button>
            </Section>
            <Text className="text-lg text-white font-ibm-plex-sans font-light my-7 whitespace-pre-line">
              {footer}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default EmailTemplate;
