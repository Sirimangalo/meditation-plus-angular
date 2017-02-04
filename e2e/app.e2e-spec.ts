import { MeditationPlusAngularPage } from './app.po';

describe('meditation-plus-angular App', function() {
  let page: MeditationPlusAngularPage;

  beforeEach(() => {
    page = new MeditationPlusAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
