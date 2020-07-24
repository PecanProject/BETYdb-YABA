import React from "react"
import { shallow } from 'enzyme'
import GMap from './components/gmap'

describe('Test the GMap Component',()=>{
    it('it should render correctly',()=>{
        const gmap = shallow(<GMap />, {
            disableLifecycleMethods: true
        });
        const geoJSON= {
            "type": "FeatureCollection",
             "features": [
               { "type": "Feature",
                 "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                 "properties": {"prop0": "value0"}
                 },
               { "type": "Feature",
                 "geometry": {
                   "type": "LineString",
                   "coordinates": [
                     [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                     ]
                   },
                 "properties": {
                   "prop0": "value0",
                   "prop1": 0.0
                   }
                 },
               { "type": "Feature",
                 "geometry": {
                   "type": "Polygon",
                   "coordinates": [
                     [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                       [100.0, 1.0], [100.0, 0.0] ]
                     ]
           
                 },
                 "properties": {
                   "prop0": "value0",
                   "prop1": {"this": "that"}
                   }
                 }
               ]
             };
        const bounds=[[0, 100],[1, 105]];
        gmap.setState({
            geoJSON,
            bounds
        })

        expect(gmap).toMatchSnapshot();
    })
})