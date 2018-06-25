import { isFunction, isEmpty } from 'lodash'
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { InputLabel, FormControl, Select, MenuItem, TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { Card, CardContent, CardHeader } from '@material-ui/core'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  select:{
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

const options = ['',
  'Attacking Midfield','Central Midfield',
  'Centre-Back', 'Centre-Forward',
  'Defensive Midfield', 'Keeper',
  'Left Midfield', 'Left Wing', 'Left-Back', 
  'Right-Back'
];

const isNumber = value => {
  const regex = /^\d.*$/
  return regex.test(value)
}
const isAlpha = value => {
  const regex = /\d.*/
  return !regex.test(value)
}


class Filter extends Component {
  constructor(props){
    super();
    this.state = {
      age:'',
      name:'',
      position: '',
      errorTextAge: '',
      errorTextName: '',
    };
    this.onFilter = this.onFilter.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset(){
    this.setState({
      age:'',
      name:'',
      position: '',
      errorTextAge: '',
      errorTextName: '',
    });
    if(isFunction(this.props.onFilter)){
      this.props.onFilter({});
    }
  }

  onFilter(){
    const { age, name } = this.state;
    let error = {};
    if(age!==''){
      if(!isNumber(age) ){
        error.errorTextAge =  'Only numbers';
      } 
      if(age<18 || age>40){
        error.errorTextAge = 'Invalid age (18-40)';
      }
    }
    if(name!==''){
      if(!isAlpha(name)){
        error.errorTextName =  'Only letters';
      }
    }
    if(!isEmpty(error, true)){
      // show errors
      this.setState(error);
      return;
    }
    if(isFunction(this.props.onFilter)){
      this.props.onFilter(this.state);
    }
  }

  onChange(key, event){
    const value = event.target.value;
    this.setState({[key]: value, errorTextAge: '', errorTextName: '' });
  }

  renderPlayerAge(){
    const { classes } = this.props
    return (
      <FormControl className={classes.formControl}>
        <TextField
          id="age"
          label={this.state.errorTextAge || "Age"}
          className={classes.textField}
          value={this.state.age}
          placeholder="player age"
          onChange={event => this.onChange('age', event)}
          margin="normal"
          error={this.state.errorTextAge!==''}
        />
      </FormControl>
    )
  }

  renderPlayerName(){
    const { classes } = this.props
    return (
      <FormControl className={classes.formControl}>
        <TextField
          id="name"
          label={this.state.errorTextName || "Name"}
          className={classes.textField}
          value={this.state.name}
          placeholder="player name"
          onChange={event => this.onChange('name', event)}
          margin="normal"
          error={this.state.errorTextName!==''}
        />
      </FormControl>
    )
  }

  renderPosition() {
    const { classes } = this.props;
    const items = options.map( (item, index) => (
      <MenuItem 
        key={index}
        value={item} 
        selected={item === this.state.position} 
      >
        {item}
      </MenuItem>
    ));
    return (
      <FormControl className={classes.formControl} style={{marginTop: '24px'}}>
        <InputLabel htmlFor="position">Position</InputLabel>
        <Select
            value={this.state.position}
            onChange={event => this.onChange('position', event)}
            inputProps={{name: 'position', id: 'position' }}
            className={classes.select}
          >
            {items}
        </Select>
      </FormControl>
    )
  }

  renderButton(){
    const { classes } = this.props
    return (
      <FormControl className={classes.formControl} style={{marginTop: '22px', width:200}}>
        <Button 
          variant="outlined" 
          color="primary" 
          className={classes.button} 
          onClick={()=>this.onFilter()}
          style={{width: '45px'}}
        >
          Search
        </Button>
        <Button 
          variant="outlined" 
          className={classes.button} 
          onClick={()=>this.reset()}
          style={{width: '45px'}}
        >
          Reset
      </Button>
      </FormControl>
  )
  }

  render(){
    const { classes } = this.props
    const htmlPosition = this.renderPosition();
    const htmlName = this.renderPlayerName();
    const htmlAge = this.renderPlayerAge();
    const htmlButton = this.renderButton();
    return (
      <Card style={{marginBottom: '50px'}}>
        <CardHeader title="Football Player Finder" />
        <CardContent>
          <form className={classes.root} autoComplete="off">
            {htmlName}
            {htmlPosition}
            {htmlAge}
            {htmlButton}
          </form>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(Filter);