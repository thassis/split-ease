import { MongoClient, Db } from 'mongodb';
import dbOperations, {getDb, getClient} from '../../lib/mongodb';
import type { Person, Item } from '../../types';

describe('Integration Tests for SplitEase', () => {
  let client: MongoClient;
  let db: Db;

  beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error('Please add your Mongo URI to .env.local');
    }
    db = await getDb();
    client = getClient();
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await db.collection('splits').deleteMany({});
  });

  test('should create a new split', async () => {
    const { id, shareId } = await dbOperations.createNewSplit();
    expect(id).toBeDefined();
    expect(shareId).toBeDefined();

    const split = await db.collection('splits').findOne({ shareId });
    expect(split).not.toBeNull();
    expect(split?.shareId).toBe(shareId);
  });

  test('should get a split by shareId', async () => {
    const { shareId } = await dbOperations.createNewSplit();
    const split = await dbOperations.getSplitByShareId(shareId);

    expect(split).not.toBeNull();
    expect(split?.shareId).toBe(shareId);
  });

  test('should update a split by adding people', async () => {
    const { shareId } = await dbOperations.createNewSplit();
        const newPeople: Person[] = [{ id: '1', name: 'Thiago', items: [] }];
    const success = await dbOperations.updateSplit(shareId, { people: newPeople });

    expect(success).toBe(true);

    const updatedSplit = await dbOperations.getSplitByShareId(shareId);
    expect(updatedSplit?.people).toEqual(newPeople);
  });

  test('should update a split by adding items', async () => {
    const { shareId } = await dbOperations.createNewSplit();
        const newItems: Item[] = [{ id: 'item1', name: 'Pizza', value: 30 }];
    const success = await dbOperations.updateSplit(shareId, { items: newItems });

    expect(success).toBe(true);

    const updatedSplit = await dbOperations.getSplitByShareId(shareId);
    expect(updatedSplit?.items).toEqual(newItems);
  });

  test('should return null for a non-existent split', async () => {
    const split = await dbOperations.getSplitByShareId('nonexistent-id');
    expect(split).toBeNull();
  });
});
