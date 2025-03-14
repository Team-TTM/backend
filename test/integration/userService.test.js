import userService from '../../src/services/userService';
import pool from '../../src/config/database';

describe('User Service - Database Tests', () => {
    const googleId = 'google_id_123';
    const facebookId = 'facebook_id_123';

    beforeAll(async () => {
        // Setup: Connecter à la base de données de test
        await db.connect();
    });

    afterAll(async () => {
        // Cleanup: Déconnecter la base de données après les tests
        await db.disconnect();
    });

    beforeEach(async () => {
        // Insérer un utilisateur de test dans la base de données avant chaque test
        await pool.query(`
      INSERT INTO users (name, google_id, facebook_id)
      VALUES ('Test User', '${googleId}', '${facebookId}')
    `);
        await pool.query(`
      INSERT INTO users (name, google_id, facebook_id)
      VALUES ('Test User', '${googleId}', '${facebookId}')
    `);
        await pool.query(`
      INSERT INTO users (name, google_id, facebook_id)
      VALUES ('Test User', '${googleId}', '${facebookId}')
    `);
        await pool.query(`
      INSERT INTO users (name, google_id, facebook_id)
      VALUES ('Test User', '${googleId}', '${facebookId}')
    `);


    });

    afterEach(async () => {
        // Supprimer l'utilisateur après chaque test pour garder la base de test propre
        await pool.query(`
      DELETE FROM users WHERE google_id = '${googleId}' AND facebook_id = '${facebookId}'
    `);
    });

    describe('findUserByGoogleId', () => {
        it('should find the user by googleId if it exists', async () => {
            const user = await userService.findUserByGoogleId(googleId);
            expect(user).toBeDefined();
            expect(user.google_id).toBe(googleId);
        });

        it('should return null if no user is found with the googleId', async () => {
            const user = await userService.findUserByGoogleId('non_existent_google_id');
            expect(user).toBeNull();
        });
    });

    describe('findUserByFacebookId', () => {
        it('should find the user by facebookId if it exists', async () => {
            const user = await userService.findUserByFacebookId(facebookId);
            expect(user).toBeDefined();
            expect(user.facebook_id).toBe(facebookId);
        });

        it('should return null if no user is found with the facebookId', async () => {
            const user = await userService.findUserByFacebookId('non_existent_facebook_id');
            expect(user).toBeNull();
        });
    });
});