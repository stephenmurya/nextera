import { gql } from "graphql-request";

export const GET_PAGE_BY_URI = gql`
  query GetPageByUri($uri: ID!, $asPreview: Boolean = false) {
    page(id: $uri, idType: URI, asPreview: $asPreview) {
      title
      slug
      uri
      status
      template {
        templateName
      }
      seo {
        title
        metaDesc
        canonical
        metaRobotsNoindex
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
      }
      pageBuilder {
        sections {
          __typename
          ... on PageBuilderSectionsHeroLayout {
            anchor
            eyebrow
            headline
            body
            primaryCta {
              label
              href
            }
            secondaryCta {
              label
              href
            }
            backgroundImage {
              node {
                sourceUrl
                altText
              }
            }
          }
          ... on PageBuilderSectionsFeatureGridLayout {
            anchor
            headline
            intro
            items: featureGridItems {
              title
              description
              icon
            }
          }
          ... on PageBuilderSectionsRichTextLayout {
            anchor
            html
          }
          ... on PageBuilderSectionsFaqLayout {
            anchor
            headline
            faqs {
              question
              answer
            }
          }
          ... on PageBuilderSectionsCtaBandLayout {
            anchor
            headline
            subheadline
            ctaButton {
              label
              href
            }
          }
          ... on PageBuilderSectionsTestimonialLayout {
            anchor
            quote
            author
            role
            company
            image {
              node {
                sourceUrl
                altText
              }
            }
          }
          ... on PageBuilderSectionsUseCasesLayout {
            anchor
            headline
            items: useCaseItems {
              title
              description
              icon
            }
          }
          ... on PageBuilderSectionsHowItWorksLayout {
            anchor
            headline
            steps {
              stepNumber
              title
              description
            }
          }
          ... on PageBuilderSectionsStatsStripLayout {
            anchor
            stats {
              value
              label
            }
          }
          ... on PageBuilderSectionsFormSectionLayout {
            anchor
            formType
            headline
            body
          }
        }
      }
    }
  }
`;

export const GET_GLOBAL_SETTINGS = gql`
  query GetGlobalSettings {
    globalSettings {
      globalContent {
        headerNav {
          label
          href
        }
        footerNav {
          label
          href
        }
        socialLinks {
          platform
          url
        }
        globalCta {
          label
          href
        }
      }
    }
  }
`;

export const GET_ALL_PAGE_URIS = gql`
  query GetAllPageUris($after: String) {
    pages(where: { status: PUBLISH }, first: 100, after: $after) {
      nodes {
        uri
        modified
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
