import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseUtils from '@fuse/utils';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
// import CardMedia from '@material-ui/core/CardMedia';
// import Card from '@material-ui/core/Card';
// import Input from '@material-ui/core/Input';
// import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
// import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
    header: {
        background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: theme.palette.primary.contrastText
    },
    panel: {
        margin: 0,
        borderWidth: '1px 1px 0 1px',
        borderStyle: 'solid',
        borderColor: theme.palette.divider,
        '&:first-child': {
            borderRadius: '16px 16px 0 0'
        },
        '&:last-child': {
            borderRadius: '0 0 16px 16px',
            borderWidth: '0 1px 1px 1px'
        },
        '&$expanded': {
            margin: 'auto'
        }
    },
    expanded: {}
}));

function FaqPage() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [searchText] = useState('');

    useEffect(() => {
        axios.get('/api/faq').then(res => {
            setData(res.data);
        });
    }, []);

    useEffect(() => {
        function getFilteredArray(arr, _searchText) {
            if (_searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, _searchText);
        }

        setFilteredData(getFilteredArray(data, searchText));
    }, [data, searchText]);

    const toggleExpansion = panel => (event, _expanded) => {
        setExpanded(_expanded ? panel : false);
    };

    console.log(expanded)

    // function handleSearch(event) {
    //  setSearchText(event.target.value);
    // }

    return (
        <div className="w-full flex flex-col flex-auto">
            <div
                className={clsx(
                    classes.header,
                    'flex flex-col flex-shrink-0 items-center justify-center text-center p-16 sm:p-24 h-200 sm:h-360'
                )}
            >
                <FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
                    <Typography color="inherit" className="text-36 sm:text-56 font-light">
                        FAQ
                    </Typography>
                </FuseAnimate>

                <FuseAnimate duration={400} delay={600}>
                    <Typography
                        variant="subtitle1"
                        color="inherit"
                        className="opacity-75 mt-8 sm:mt-16 mx-auto max-w-512"
                    >
                        Frequently asked questions
                    </Typography>
                </FuseAnimate>
            </div>

            <div className="flex flex-col flex-1 flex-shrink-0 max-w-xl w-full mx-auto px-16 sm:px-24 py-24 sm:py-32">
                {filteredData.length === 0 && (
                    <div className="flex flex-auto items-center justify-center w-full h-full">
                        <Typography color="textSecondary" variant="h5">
                            There are no faqs!
                        </Typography>
                    </div>
                )}
                <FuseAnimateGroup
                    enter={{
                        animation: 'transition.slideUpBigIn'
                    }}
                >
                            <ExpansionPanel

                                classes={{
                                    root: classes.panel,
                                    expanded: classes.expanded
                                }}
                                key='1'
                                // expanded={expanded}
                                onChange={toggleExpansion(1)}
                                elevation={0}
                            >
                                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                                    <div className="flex items-center">
                                        <Icon color="action">help_outline</Icon>
                                        <Typography className="px-8">What does Local Links Connector Do?</Typography>
                                    </div>
                                </ExpansionPanelSummary>

                                <ExpansionPanelDetails>
                            <Typography className="">We connect local retail, arts, entertainment, tourism, health, spa, and those places the people love with the business services that best help them connect their ideal customer. We’re an ideal customer connector. We’re concierge connections</Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                            <ExpansionPanel
                        classes={{
                            root: classes.panel,
                            expanded: classes.expanded
                        }}
                        key='7'
                        // expanded={expanded}
                        onChange={toggleExpansion(7)}
                        elevation={0}
                    >
                        <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                            <div className="flex items-center">
                                <Icon color="action">help_outline</Icon>
                                <Typography className="px-8">How does it work?</Typography>
                            </div>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails>
                            <Typography className="">
                                <p>Two ways!</p>
                                <br/>
                                <ul>
                                    <li style={{"margin-left": "15px"}}>
                                        a. If you know what you’re looking for, you pick the service, budget, and project timeline needs. 
                                        </li>
                                    <br />
                                    <li style={{ "margin-left": "15px" }}>
                                        b. If you don’t know what you’re looking for, 
                                        {/* <a href="https://easyalfred.com/rental-owners/" rel="noopener noreferrer" target="_blank"> Speak to a Connector</a>. */}
                                        <a href="tel:1-877-658-1429"> Speak to a Connector</a>
                                        We help you define your needs/missing opportunities for new customers.
                                    </li>
                                </ul>
                                <br />
                                <p>Either way, the end result is multiple proposals from business services that are either in your area or experts in what you need.</p>
                                <p>We coordinate a better connection between Local Business, People, and Local Business Services. </p>
                                <br />
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                            <ExpansionPanel
                                classes={{
                                    root: classes.panel,
                                    expanded: classes.expanded
                                }}
                                key='2'
                                // expanded={expanded}
                                onChange={toggleExpansion(2)}
                                elevation={0}
                            >
                                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                                    <div className="flex items-center">
                                        <Icon color="action">help_outline</Icon>
                                <Typography className="px-8">What can I expect from Local links?</Typography>
                                    </div>
                                </ExpansionPanelSummary>


                                <ExpansionPanelDetails>
                                    <Typography className="">
                                        <ul>
                                            <li>
                                        a. Connect and confirm who best fits your team, your brand, your business/personal identity. 
                                                            </li>
                                            <br />
                                            <li>
                                        b. We schedule a phone and/or Video call with you and our local business services.
                                                            </li>
                                            <br />
                                            <li>
                                        c. We match your pricing needs by establishing budget alignment right from the start. Skip the negotiation and focus on confirming the ideal match.
                                                            </li>
                                        </ul>
                                    </Typography>
                                </ExpansionPanelDetails>

                               
                            </ExpansionPanel>
            
                            <ExpansionPanel
                                classes={{
                                    root: classes.panel,
                                    expanded: classes.expanded
                                }}
                                key='3'
                                // expanded={expanded}
                                onChange={toggleExpansion(3)}
                                elevation={0}
                            >
                                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                                    <div className="flex items-center">
                                        <Icon color="action">help_outline</Icon>
                                <Typography className="px-8">How does Local links make money?</Typography>
                                    </div>
                                </ExpansionPanelSummary>

                            <ExpansionPanelDetails>
                                <Typography className="">
                                <p>We believe in Transparency. Easy Alfred Inc AKA Local Links is a transaction fee service provider helping businesses connect to consumers with more accuracy. We earn a 15%-20% fee from our service- businesses for connecting.</p>
                                    <br />
                                    <ul>
                                        <li style={{ "margin-left": "15px" }}>
                                            a. B2B based connections are generally 20% of MSRP 
                                        </li>
                                        <br />
                                        <li style={{ "margin-left": "15px" }}>
                                            b. B2C based connections like Food and Beverage are 15% of the MSRP + a 5% connection fee for our consumers.
                                        </li>
                                    </ul>
                                </Typography>
                            </ExpansionPanelDetails>

                            </ExpansionPanel>
                            
                            <ExpansionPanel
                                classes={{
                                    root: classes.panel,
                                    expanded: classes.expanded
                                }}
                                key='4'
                                onChange={toggleExpansion(4)}
                                elevation={0}
                            >
                                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                                    <div className="flex items-center">
                                        <Icon color="action">help_outline</Icon>
                                <Typography className="px-8">Do you work for these businesses?</Typography>
                                    </div>
                                </ExpansionPanelSummary>

                                <ExpansionPanelDetails>
                            <Typography className="">Please consider our team a connector but not a member of our (vendor) Power Partner’s teams. We’re a business matchmaker. We can only recommend based on our experience and the experience of the people who recommend the business. We rely on you, our customer and the power partner to identify when we’ve hit or missed the mark. </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                </FuseAnimateGroup>
            </div>
        </div>
    );
}

export default FaqPage;

