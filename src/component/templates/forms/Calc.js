import _ from 'lodash'
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { GridStatus } from '../../../redux/actions';

const totalCal = (results) => {
    let totalValue = 0;

    //// console.log('check', results)
    for (const key in results) {
        for (const value in results[key]) {
            if (typeof results[key][value] === "string") {
                const output = parseInt(results[key][value], 10);
                totalValue = totalValue + (Number.isNaN(output) ? 0 : output);
            } else {
                totalValue = totalValue + totalCal(results[key][value], totalValue);
            }
        }
    }

    return totalValue;
}

export const Calc = ({ control, setValue, comp }) => {
    const results = useWatch({ control, name: 'inputgrid' });

    //const dispatch = useDispatch()





    useEffect(() => {

        //// console.log('set dah', results)

        const filterComp = _.filter(comp, (x) => !_.isNull(x.footer))

        const changes = []

        _.map(filterComp, x => {
            let value = 0
            _.map(results, (r, i) => {
                //     value += _.isUndefined(r[x.registername]) ? 0 : r[x.registername]

                if (x.footer === 'summary') {
                    value += _.isUndefined(r[x.registername]) ? 0 : r[x.registername]
                }
                else {
                    value = i + 1

                }

            })

            if (value !== 0)
                changes.push({ [`${x.registername}summarydisplayonly`]: value })
        })

        //   // console.log(changes.length)

        if (changes.length > 0) {
            _.map(changes, x => {
                const k = _.keys(x)
                const v = x[k]

                //// console.log(x)

                if (v !== 0) {
                    //  // console.log('changess ', control, setValue, k[0])


                    setValue(k[0], v)// _.isNaN(v) ? 0 : v)
                    //    // console.log(k[0], v)
                }
            })

            //  dispatch(GridStatus())
        }

    }, [results])

    return <></>
};
