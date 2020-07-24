import React from "react"
import { shallow, mount } from 'enzyme'
import Grid from './components/grid'

describe('Test the Grid Component',()=>{
    it('it should render correctly',()=>{
        let experiments=[
            {
                "experiments": "MAC Season 8: Border ",
                "x": 1,
                "y": 1
            },
            {
                "experiments": "MAC Season 8: Uniformity ",
                "x": 5,
                "y": 3
            },
            {
                "experiments": "MAC Season 8: DP4 ",
                "x": 2,
                "y": 7
            },
            {
                "experiments": "MAC Season 8: DP ",
                "x": 10,
                "y": 2
            },
            {
                "experiments": "MAC Season 8: DP test",
                "x": 10,
                "y": 3
            }
        ];
        const grid= shallow(<Grid data={experiments} type='experiments' input={true} />);
        const instance= grid.instance();
        instance.componentDidMount();
        expect(grid.state('label')).toEqual(["MAC Season 8: Border ", "MAC Season 8: Uniformity ", "MAC Season 8: DP4 ", "MAC Season 8: DP ", "MAC Season 8: DP test"]);
        expect(grid.state('list')).toEqual([["MAC Season 8: Border ", "Range 1 Column 1"], ["MAC Season 8: DP4 ", "Range 2 Column 7"], ["MAC Season 8: Uniformity ", "Range 5 Column 3"], ["MAC Season 8: DP ", "Range 10 Column 2"], ["MAC Season 8: DP test", "Range 10 Column 3"]]);
    });
});