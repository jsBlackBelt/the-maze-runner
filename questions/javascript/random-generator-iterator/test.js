module.exports = {
    test: (main, chai) => {
        const orig = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        const res1 = [...main(orig)];
        const res2 = [...main(orig)];

        const condition = res1.some((val, idx) => res1[idx] != res2[idx]);

        return chai.expect(
            condition,
            'Some items in the same index should be different'
        ).to.be.true;
    },
};
