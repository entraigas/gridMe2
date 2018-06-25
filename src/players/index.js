import { deburr } from 'lodash';
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { makePlayersGetter } from './selectors'
import { Paper } from '@material-ui/core';
import { actionChangePlayerProps, actionFetchPlayersData } from './actions';
import PaginatedGrid from './components/PaginatedGrid';
import Filter from './components/Filter'

const calculateAge = (birthdayString) => {
    const birthday = new Date(birthdayString);
    const diffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

class index extends Component {
    constructor(props){
        super(props);
        this.state = {
            filter: {},
        }
    }
    componentWillMount() {
        this.props.actionFetchPlayersData();
    }

    onFilter(filterValues){
        this.setState({filter: filterValues});
    }

    applyFilter(data){
        const {age='', name='', position=''} = this.state.filter;
        let retval = data;
        if(age!==''){
            retval = retval.filter(item => calculateAge(item.dateOfBirth).toString() === age)
        }
        if(name!==''){
            const search = deburr(name).toUpperCase();
            retval = retval.filter(item => deburr(item.name.toUpperCase()).indexOf(search) !== -1? true : false)
        }
        if(position!==''){
            retval = retval.filter(item => item.position === position)
        }
        return retval;
    }

    renderTable (){
        const {data, isLoading} = this.props.players;
        const grid = {
            items: this.applyFilter(data),
            isLoading:isLoading
        }
        const display = {
            name: 'Player',
            position: 'Position',
            nationality: 'Team',
            dateOfBirth: {
                header: 'Age',
                render: row => calculateAge(row.dateOfBirth)
            }
        }
        return (
            <PaginatedGrid grid={grid} display={display} />
        );
    }

    renderFilter(){
        const onFilter = this.onFilter.bind(this);
        return <Filter onFilter={onFilter} />
    }

    render(){
        const { errors } = this.props.players;
        const htmlFiltro = this.renderFilter();
        const htmlTable = this.renderTable();
        return (
            <div style={{padding:'50px'}}>
            {htmlFiltro}
            <Paper>
                {htmlTable}
            </Paper>
            {errors}
            </div>
        )
    }
}

function mapStateToProps(store) {
    const getPlayers = makePlayersGetter();
    return {
        players: getPlayers(store),
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionChangePlayerProps,
            actionFetchPlayersData,
        },
        dispatch
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(index);
