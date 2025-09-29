import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Dummy JSON', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://dummyjson.com';

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

    it('Get product that does not exist', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/9999`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectJson({
          message: "Product with id '9999' not found",
        });
    })

    it('Search products', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/search`)
        .withQueryParams('q', 'phone')
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          products: [
            {
              id: 101,
              title: "Apple AirPods Max Silver",
              description: "The Apple AirPods Max in Silver are premium over-ear headphones with high-fidelity audio, adaptive EQ, and active noise cancellation. Experience immersive sound in style.",
              category: "mobile-accessories",
              price: 549.99,
              discountPercentage: 13.67,
              rating: 3.47,
              stock: 59,
            }
          ]
        });
    });

    it('Search products with no match', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/search`)
        .withQueryParams('q', 'nonexistentproduct')
        .expectStatus(StatusCodes.OK)
        .expectJson({
          products: [],
          total: 0,
          skip: 0,
          limit: 0
        });
    })

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

    it('Update Product that does not exist', async () => {
      await p
        .spec()
        .patch(`${baseUrl}/products/9999`)
        .withJson({
          price: 10.99
        })
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectJson({
          message: "Product with id '9999' not found",
        });
    })
    
    it ('Delete Product', async () => {
      await p
        .spec()
        .patch(`${baseUrl}/products/20`)
        .expectStatus(StatusCodes.OK)
    });

    it('Delete Product that does not exist', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/products/9999`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectJson({
          message: "Product with id '9999' not found",
        });
    });
  });
});
