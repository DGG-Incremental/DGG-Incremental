import React from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import Action from "../Action";

export default class CoinGenerator extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            count: 0,
            cost: this.props.cost,
        }
        this.onPurchase = this.onPurchase.bind(this);
    }

    onPurchase () {
       if(this.props.click(new Action("click", 0, this.props.rate, this.props.cost, this.props.generatorName))) {
           this.setState({count: this.state.count + 1});
           this.props.increaseRate(this.props.rate);
       };
    }

    render(){
        return (
            <div>
                <Card>
                    <CardBody>
                        <CardTitle>{this.props.generatorName}</CardTitle>
                        <CardText>{this.props.generatorDescription}, you own {this.state.count}.</CardText>
                        <Button onClick={this.onPurchase}>Buy 1, costs {this.props.cost}</Button>
                    </CardBody>
                </Card>
            </div>
        );
    }
}