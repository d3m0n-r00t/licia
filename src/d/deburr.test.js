it('basic', () => {
    expect(deburr('déjà vu')).to.equal('deja vu');
});