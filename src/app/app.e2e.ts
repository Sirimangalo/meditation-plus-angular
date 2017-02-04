describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });


  it('should have a title', () => {
    const subject = browser.getTitle();
    const result  = 'Angular2 Webpack Starter by @gdi2290 from @AngularClass';
    expect(subject).toEqual(result);
  });

  it('should have <header>', () => {
    const subject = element(by.css('app header')).isPresent();
    const result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <main>', () => {
    const subject = element(by.css('app main')).isPresent();
    const result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <footer>', () => {
    const subject = element(by.css('app footer')).getText();
    const result  = 'WebPack Angular 2 Starter by @AngularClass';
    expect(subject).toEqual(result);
  });

});
