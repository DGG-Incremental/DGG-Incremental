import React from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,
    Container, Row, Col, CardHeader
} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';

import Action from "../Action";
import CoinGenerator from "./CoinGenerator";

export default class CoinGeneratorCollection extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currencyCount: 5000,
            totalRate: 0,
        }
        this.increaseRate = this.increaseRate.bind(this);
        this.click = this.click.bind(this);
        this.basicClick = this.click.bind(this);
    }

    increaseRate (rate) {
        this.setState({totalRate: this.state.totalRate + rate});
    }

    basicClick () {
        this.click(new Action("click", 1, 0, 0, "click"));
    }

    click (action) {
        return this.props.click(action);
        this.setState({});
    }

    render () {
        return (
            <div>
                <Card body className="text-left">
                    <CardHeader>COOM emporium</CardHeader>
                    <CardBody>
                        <CardTitle>COOM Generators</CardTitle>
                        <CardSubtitle>You currently have {this.props.score} COOMS.</CardSubtitle>
                        <Button onClick={this.basicClick}>Click this to get one COOM!</Button>
                        <CardText>These are all of the different things you can buy to generate coins. You generate {this.props.passiveIncome} per second.</CardText>
                        <CoinGenerator generatorName="cucklord"
                                       rate={1} cost={50}
                                       generatorDescription="Generates 1 COOM per second, costs 50 COOM"
                                       increaseRate={this.increaseRate} click={this.click}/>
                    </CardBody>
                    <br></br>
                    <CardBody>
                        <CoinGenerator generatorName="full harem"
                                       rate={10} cost={500}
                                       generatorDescription="Generates 10 COOM per second, costs 500 COOMS"
                                       increaseRate={this.increaseRate} click={this.click}/>

                    </CardBody>
                </Card>
            </div>
        );
    };
};