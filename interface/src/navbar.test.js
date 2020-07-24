import React from 'react'
import { shallow } from 'enzyme'
import Navbar from './components/navbar'

describe('Test Navbar Component', () => {
  it('should render correctly', () => {
    const navbar = shallow(<Navbar />);
    expect(navbar.find('[data-testid="Pecan-img"]').prop('href')).toEqual("http://pecanproject.org/");
    expect(navbar.find('[data-testid="Pecan-site"]').prop('href')).toEqual("http://pecanproject.org/");
    expect(navbar.find('[data-testid="BETYdb-github"]').prop('href')).toEqual("http://github.com/PecanProject/BETYdb-YABA/");
  });
});