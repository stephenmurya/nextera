import { gql } from "graphql-request";

export const GET_PAGE_BY_URI = gql`
  query GetPageByUri($uri: ID!, $asPreview: Boolean = false) {
    page(id: $uri, idType: URI, asPreview: $asPreview) {
      title
      slug
      uri
      seo {
        title
        metaDesc
        canonical
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
            primaryCta: primarycta {
              label
              href: herf
            }
            secondaryCta: secondarycta {
              label
              href
            }
            backgroundImage: backgroundimage {
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
            items {
              title
              description
              icon
            }
          }
          ... on PageBuilderSectionsRichTextLayout {
            anchor
            html
          }
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
