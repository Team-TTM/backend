const { getAllAdherents } = require('../../src/models/adherantModel');

const test = async () => {
    try {
        const ad = await getAllAdherents();
        console.log(ad);
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
};

test();
