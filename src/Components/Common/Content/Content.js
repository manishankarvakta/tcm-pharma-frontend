import React from 'react';
import { Container, Row } from 'react-bootstrap';

const Content = () => {
    return (
        <Container>
            <Row>
                <div className="col-md-3">
                    side bar
                </div>
                <div className="col-md-9"></div>
            </Row>
        </Container>
    );
};

export default Content;