import React from "react"
import { shallow } from 'enzyme'
import GMap from './components/gmap'

describe('Test the GMap Component',()=>{
    it('it should render correctly',()=>{
        const sites= [
          {
              "experiments": "MAC Season 8: Border ",
              "polygon": {
                  "type": "Polygon",
                  "coordinates": [
                    [
                        [
                            -111.97505513256,
                            33.0745586798386,
                            115
                        ],
                        [
                            -111.975038806328,
                            33.0745586755482,
                            115
                        ],
                        [
                            -111.975038816222,
                            33.074532021604,
                            115
                        ],
                        [
                            -111.975055142448,
                            33.0745320258945,
                            115
                        ],
                        [
                            -111.97505513256,
                            33.0745586798386,
                            115
                        ]
                    ]
                ]
              },
          },
          {
              "experiments": "MAC Season 8: Uniformity ",
              "polygon": {
                  "type": "Polygon",
                  "coordinates": [
                    [
                        [
                            -111.975038806328,
                            33.0745586755482,
                            115
                        ],
                        [
                            -111.975022480098,
                            33.0745586713459,
                            115
                        ],
                        [
                            -111.975022489995,
                            33.0745320173113,
                            115
                        ],
                        [
                            -111.975038816222,
                            33.074532021604,
                            115
                        ],
                        [
                            -111.975038806328,
                            33.0745586755482,
                            115
                        ]
                    ]
                ]
              }
          },
          {
              "experiments": "MAC Season 8: DP4 ",
              "polygon": {
                  "type": "Polygon",
                  "coordinates": [
                    [
                        [
                            -111.975022480098,
                            33.0745586713459,
                            115
                        ],
                        [
                            -111.975006153866,
                            33.0745586670512,
                            115
                        ],
                        [
                            -111.975006163769,
                            33.0745320130166,
                            115
                        ],
                        [
                            -111.975022489995,
                            33.0745320173113,
                            115
                        ],
                        [
                            -111.975022480098,
                            33.0745586713459,
                            115
                        ]
                    ]
                ]
              }
          }
      ];
      const features= [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -111.97505513256,
                            33.0745586798386,
                            115
                        ],
                        [
                            -111.975038806328,
                            33.0745586755482,
                            115
                        ],
                        [
                            -111.975038816222,
                            33.074532021604,
                            115
                        ],
                        [
                            -111.975055142448,
                            33.0745320258945,
                            115
                        ],
                        [
                            -111.97505513256,
                            33.0745586798386,
                            115
                        ]
                    ]
                ]
            },
            "properties": {
                "Id": 1,
                "rep": 0,
                "f_range": 1,
                "f_column": 1,
                "row": "B",
                "plotid": 101,
                "treatment": 900,
                "experiment": "border",
                "variety": "tiburon in border",
                "notes": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -111.975038806328,
                            33.0745586755482,
                            115
                        ],
                        [
                            -111.975022480098,
                            33.0745586713459,
                            115
                        ],
                        [
                            -111.975022489995,
                            33.0745320173113,
                            115
                        ],
                        [
                            -111.975038816222,
                            33.074532021604,
                            115
                        ],
                        [
                            -111.975038806328,
                            33.0745586755482,
                            115
                        ]
                    ]
                ]
            },
            "properties": {
                "Id": 2,
                "rep": 0,
                "f_range": 1,
                "f_column": 2,
                "row": "B",
                "plotid": 102,
                "treatment": 900,
                "experiment": "border",
                "variety": "tiburon in border",
                "notes": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -111.975022480098,
                            33.0745586713459,
                            115
                        ],
                        [
                            -111.975006153866,
                            33.0745586670512,
                            115
                        ],
                        [
                            -111.975006163769,
                            33.0745320130166,
                            115
                        ],
                        [
                            -111.975022489995,
                            33.0745320173113,
                            115
                        ],
                        [
                            -111.975022480098,
                            33.0745586713459,
                            115
                        ]
                    ]
                ]
            },
            "properties": {
                "Id": 3,
                "rep": 0,
                "f_range": 1,
                "f_column": 3,
                "row": "B",
                "plotid": 103,
                "treatment": 900,
                "experiment": "border",
                "variety": "tiburon in border",
                "notes": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -111.975006153866,
                            33.0745586670512,
                            115
                        ],
                        [
                            -111.974989827634,
                            33.0745586627543,
                            115
                        ],
                        [
                            -111.974989837542,
                            33.0745320087196,
                            115
                        ],
                        [
                            -111.975006163769,
                            33.0745320130166,
                            115
                        ],
                        [
                            -111.975006153866,
                            33.0745586670512,
                            115
                        ]
                    ]
                ]
            },
            "properties": {
                "Id": 4,
                "rep": 0,
                "f_range": 1,
                "f_column": 4,
                "row": "B",
                "plotid": 104,
                "treatment": 900,
                "experiment": "border",
                "variety": "tiburon in border",
                "notes": ""
            }
        }
      ];
        const bounds=[ [33.0745319570799, -111.975055142448], [33.0764637066593, -111.974793202983]];
        const colors= ["red", "blue", "green", "yellow"]
        const gmap = shallow(<GMap.WrappedComponent type="experiments"/>, {
          disableLifecycleMethods: true
        });
        gmap.setState({
            sites,
            features,
            bounds,
            colors
        });
        expect(gmap).toMatchSnapshot();
    })
})