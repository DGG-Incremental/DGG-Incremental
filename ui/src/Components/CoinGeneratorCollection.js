import React from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container, Row, Col, CardHeader
} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';

import Action from "../game";
import CoinGenerator from "./CoinGenerator";

export default class CoinGeneratorCollection extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currencyCount: 5000,
            totalRate: 0,
        }
        this.deduct = this.deduct.bind(this);
        this.increaseRate = this.increaseRate.bind(this);
        this.update = this.update.bind(this);
        this.click = this.click.bind(this);
        this.coinClick = this.coinClick.bind(this);
    }

    deduct (cost) {
        if (this.state.currencyCount >= cost) {
            this.setState({currencyCount: this.state.currencyCount - cost});
            return true;
        }
        return false;
    }

    increaseRate (rate) {
        this.setState({totalRate: this.state.totalRate + rate});
    }

    update () {
        this.setState({currencyCount: this.state.currencyCount + this.state.totalRate});
    }

    coinClick () {
        this.setState({currencyCount: this.state.currencyCount + 1});
    }

    click (action) {
        this.props.click(action);
    }

    componentDidMount () {
        this.interval = setInterval(() => this.update(), 1000);
    }

    componentWillUnmount () {
        clearInterval(this.interval);
    }

    render () {
        console.log(this.state.currencyCount, this.state.totalRate);
        return (
            <div>
                <Card body className="text-left">
                    <CardHeader>Store</CardHeader>
                    <CardBody>
                        <CardTitle>Coin Generators</CardTitle>
                        <CardSubtitle>You currently have {this.state.currencyCount} coins.</CardSubtitle>
                        <Button onClick={this.coinClick}>Click this to get one coin!</Button>
                        <CardText>These are all of the different things you can buy to generate coins. You generate {this.state.totalRate} per second.</CardText>
                        <CoinGenerator generatorName="Weak Generator"
                                       rate={1} cost={50}
                                       generatorDescription="Generates 1 coin per second, costs 50 money"
                                       deduct={this.deduct} increaseRate={this.increaseRate} executeAction={this.click}/>
                    </CardBody>
                    <br></br>
                    <CardBody>
                        <CoinGenerator generatorName="Medium Generator"
                                       rate={10} cost={500}
                                       generatorDescription="Generates 10 coin per second, costs 500 money"
                                       deduct={this.deduct} increaseRate={this.increaseRate} executeAction={this.click}/>

                    </CardBody>
                </Card>
            </div>
        );
    };
};