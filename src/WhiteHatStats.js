import React, {useEffect, useRef,useMemo} from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as d3 from 'd3';


//change the code below to modify the bottom plot view
export default function WhiteHatStats(props){
    const d3Container = useRef(null);
    const [svg, height, width, tTip] = useSVGCanvas(d3Container);

    const margin = { top: 60, right: 30, bottom: 60, left: 60 };

    useEffect(()=>{
        if (!svg || !props.data) return;

        const data = props.data.states;

        // Prepare data in suitable format for stacking
        const plotData = data.map(state => {
            return {
                'name': state.state,
                'male_count': state.male_count,
                'female_count': state.count - state.male_count // Assuming count is total
            };
        });

        // Define scales
        const xScale = d3.scaleBand()
            .domain(plotData.map(d => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(plotData, d => d.male_count + d.female_count)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Stack generator
        const stack = d3.stack()
            .keys(['male_count', 'female_count'])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        const stackedData = stack(plotData);

        // Draw male deaths bars
        svg.selectAll('.male-bars').remove();
        const maleBars = svg.selectAll('.male-bars')
            .data(stackedData[0])
            .enter().append('rect')
            .attr('class', 'male-bars')
            .attr('x', d => xScale(d.data.name))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth())
            .attr('fill', 'steelblue')
            .on('mouseover', (e, d) => {
                const string = `${d.data.name}</br>Male Deaths: ${d.data.male_count}`;
                props.ToolTip.moveTTipEvent(tTip, e);
                tTip.html(string);
            })
            .on('mousemove', (e) => {
                props.ToolTip.moveTTipEvent(tTip, e);
            })
            .on('mouseout', () => {
                props.ToolTip.hideTTip(tTip);
            });

        // Draw female deaths bars on top of male deaths bars
        svg.selectAll('.female-bars').remove();
        const femaleBars = svg.selectAll('.female-bars')
            .data(stackedData[1])
            .enter().append('rect')
            .attr('class', 'female-bars')
            .attr('x', d => xScale(d.data.name))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth())
            .attr('fill', 'pink')
            .on('mouseover', (e, d) => {
                const string = `${d.data.name}</br>Female Deaths: ${d.data.female_count}`;
                
                props.ToolTip.moveTTipEvent(tTip, e);
                
                tTip.html(string);
            })
            .on('mousemove', (e) => {
                props.ToolTip.moveTTipEvent(tTip, e);
            })
            .on('mouseout', () => {
                props.ToolTip.hideTTip(tTip);
            });

        // Draw x-axis
        svg.selectAll('.x-axis').remove();
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('dy', '1em')
            .style('text-anchor', 'middle');

        // Draw y-axis
        svg.selectAll('.y-axis').remove();
        svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        // Change the title
        const labelSize = margin.top / 2;
        svg.selectAll('text').remove();
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', labelSize)
            .attr('text-anchor', 'middle')
            .attr('font-size', labelSize)
            .attr('font-weight', 'bold')
            .text('Gun Deaths by State');

    }, [props.data, svg]);

    return (
        <div
            className={"d3-component"}
            style={{ 'height': '99%', 'width': '99%' }}
            ref={d3Container}
        ></div>
    );
}
//END of TODO #1.
/////////////////////////////////////////////////////////////////////////


//////////////////////
 
const drawingDifficulty = {
    'IL': 9,
    'AL': 2,
    'AK': 1,
    'AR': 3,
    'CA': 9.51,
    'CO': 0,
    'DE': 3.1,
    'DC': 1.3,
    'FL': 8.9,
    'GA': 3.9,
    'HI': 4.5,
    'ID': 4,
    'IN': 4.3,
    'IA': 4.1,
    'KS': 1.6,
    'KY': 7,
    'LA': 6.5,
    'MN': 2.1,
    'MO': 5.5,
    'ME': 7.44,
    'MD': 10,
    'MA': 6.8,
    'MI': 9.7,
    'MN': 5.1,
    'MS': 3.8,
    'MT': 1.4,
    'NE': 1.9,
    'NV': .5,
    'NH': 3.7,
    'NJ': 9.1,
    'NM': .2,
    'NY': 8.7,
    'NC': 8.5,
    'ND': 2.3,
    'OH': 5.8,
    'OK': 6.05,
    'OR': 4.7,
    'PA': 4.01,
    'RI': 8.4,
    'SC': 7.1,
    'SD': .9,
    'TN': 3.333333,
    'TX': 8.1,
    'UT': 2.8,
    'VT': 2.6,
    'VA': 8.2,
    'WA': 9.2,
    'WV': 7.9,
    'WY': 0,
}
