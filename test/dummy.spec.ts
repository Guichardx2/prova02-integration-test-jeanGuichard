import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Dummy JSON', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://dummyjson.com';
  let deckId = '';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Products', () => {

    it('Get All Products', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          products: [
            {
              id: 1,
              title: 'Essence Mascara Lash Princess',
            },
          ],
        });
    });

    it('Get a Product by ID', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/26`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 26,
          title: "Green Chili Pepper",
          description: "Spicy green chili pepper, ideal for adding heat to your favorite recipes.",
          category: "groceries",
          price: 0.99,
          discountPercentage: 1,
          rating: 3.66,
          stock: 3,
        });
    });

    it('New Product', async () => {
      await p
        .spec()
        .post(`${baseUrl}/products/add`)
        .withJson({
          title: 'BMW Pencil',
          description: 'Pencil for BMW lovers',
          price: 1.99,
          discountPercentage: 5,
          rating: 4.5,
          stock: 100,
          brand: 'BMW',
          category: 'stationery',
        })
        .expectStatus(StatusCodes.CREATED)
        .returns('id');
    });

    it ('Update Product', async () => {
      await p
        .spec()
        .patch(`${baseUrl}/products/20`)
        .withJson({
          price: 10.99
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 20,
          price: 10.99
        });
    });
  });
});
