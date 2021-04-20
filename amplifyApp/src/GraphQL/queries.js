/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPicture = /* GraphQL */ `
  query GetPicture($id: ID!) {
    getPicture(id: $id) {
      id
      name
      owner
      visibility
      file {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPictures = /* GraphQL */ `
  query ListPictures(
    $filter: ModelPictureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPictures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        owner
        visibility
        file {
          bucket
          region
          key
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
