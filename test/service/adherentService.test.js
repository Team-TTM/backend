const { getAllAdherents } = require('../../src/services/adherantService');

const test = async () => {
    try {
        const ad = await getAllAdherents();
        console.log(ad);
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
};

test();