import config from "@/lib/config";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { textWithBreaks } from "@/lib/utils";

interface EmailTemplateProps {
  previewText: string;
  header: string;
  body: string[];
  buttonText: string;
  buttonUrl: string;
  footer: string;
}

const baseUrl = config.env.prodApiEndpoint;

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
      <Head>
        <style>
          {`
            @media (max-width: 600px) {
              .main-container {
                width: 100% !important;
                margin: 0 auto !important;
                padding: 20px !important;
              }
            }
          `}
        </style>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#111624] my-auto mx-auto font-ibm-plex-sans">
          <Container className="main-container my-10 mx-8 px-5 py-10">
            <Section className="border-b border-dashed border-[#232839] pb-7">
              <Row>
                <Column width="47">
                  <Img
                    src={`${baseUrl}/icons/logo.png`}
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
            <Heading className="text-2xl text-white font-ibm-plex-sans font-bold mt-10">
              {textWithBreaks({ text: header })}
            </Heading>
            {body.map((item) => (
              <Text className="text-lg text-white font-ibm-plex-sans font-light my-7">
                {textWithBreaks({ text: item })}
              </Text>
            ))}
            <Section className="text-start">
              <Button
                className="bg-[#e7c9a5] text-[#111624] inline-flex h-[46px] w-[177px] p-2 items-center justify-center rounded-md font-ibm-plex-sans font-semibold text-base"
                href={buttonUrl}
              >
                {buttonText}
              </Button>
            </Section>
            <Text className="text-lg text-white font-ibm-plex-sans font-light my-7">
              {textWithBreaks({ text: footer })}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default EmailTemplate;
