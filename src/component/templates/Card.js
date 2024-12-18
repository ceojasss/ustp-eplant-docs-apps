import React from 'react'
import { Card, Icon, Label, Header } from "semantic-ui-react";
import { connect } from 'react-redux';
import _ from 'lodash'

const CardDynamic = ({ total, name, icon, color }) => {
  return (<Card style={{ margin: 20 }}>
    <Card.Content >
      <Header as='h2'>
        <Icon color={color} name={icon} />
        <Header.Content>
          {total}
          <Header.Subheader>{name}</Header.Subheader>
        </Header.Content>
      </Header>
    </Card.Content>
  </Card>
  )
}


export default CardDynamic