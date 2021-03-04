import React, { PureComponent } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Chart ({data}) {
    console.log(data)

    // const data = [
    //     { x: 100, y: 200, z: 200 },
    //     { x: 120, y: 100, z: 260 },
    //     { x: 170, y: 300, z: 400 },
    //     { x: 140, y: 250, z: 280 },
    //     { x: 150, y: 400, z: 500 },
    //     { x: 110, y: 280, z: 200 },
    //   ];

    const TTComp = (data) => {
        console.log(`Data inside ttcomp: ${JSON.stringify(data)}`)
        let thingToShow = ''

        if (data.data.length > 0) {
            thingToShow = data.data[0].payload.track
        }

        return (
            <div>
                {thingToShow}
            </div>
        )
    }
    return (
      <div>
        <ScatterChart
          width={400}
          height={400}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
          data={data}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="rank" name="rank" />
          <YAxis type="number" dataKey="danceability" name="danceabliility" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={(data) => <TTComp data={data.payload}/>}/>
          <Scatter name="A school" data={data} fill="#8884d8" />
        </ScatterChart>
      </div>
    )
}

export default Chart