import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Filter from '../Filter';

describe('A suite', function() {
  test('should render three <Filter /> components', () => {
    //expect(shallow(<Filter />).is('.foo')).toBe(true);
    const wrapper = shallow(<Filter />);
    expect(wrapper.find(Filter)).not.toBeNull();
  });

});