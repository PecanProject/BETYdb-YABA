import React from 'react'
import { shallow } from 'enzyme'
import Footer from './components/footer'

describe('Test Footer Component', () => {
  it('should render correctly', () => {
    const footer = shallow(<Footer />);
    expect(footer.find('[data-testid="Pecan-site"]').prop('href')).toEqual("http://pecanproject.org/");
    expect(footer.find('[data-testid="Pecan-github"]').prop('href')).toEqual("http://github.com/PecanProject/");
    expect(footer.find('[data-testid="Pecan-twitter"]').prop('href')).toEqual("http://twitter.com/pecanproject");
    expect(footer.find('[data-testid="BETYdb-github"]').prop('href')).toEqual("http://github.com/PecanProject/BETYdb-YABA/");
    expect(footer.find('[data-testid="BETYdb-twitter"]').prop('href')).toEqual("http://twitter.com/betydatabase");
  });
});