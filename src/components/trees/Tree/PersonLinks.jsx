import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styles from './styles.scss'
import {
  NODE_BUTTON_RADIUS,
  NODE_HEIGHT,
  NODE_SMALL_AVATAR_RADIUS,
  NODE_AVATAR_RADIUS,
  LINK_BUTTON_PATTERN
} from './constants'

class PersonLinks extends Component {
  constructor (props) {
    super(props)

    this.state = {
      linksOpen: false
    }

    this.handleToggleLinks = this.handleToggleLinks.bind(this)
    this.goToTree = this.goToTree.bind(this)
  }

  handleToggleLinks () {
    this.setState({
      linksOpen: !this.state.linksOpen
    })
  }

  goToTree (treeId, personId) {
    this.props.history.push({
      pathname: `/public/${treeId}?p=${personId}`
    })
  }

  render () {
    // icon position
    const offset = this.props.small ? NODE_SMALL_AVATAR_RADIUS : NODE_AVATAR_RADIUS
    const centered = NODE_BUTTON_RADIUS + (NODE_HEIGHT - NODE_BUTTON_RADIUS * 2) / 2

    // list position
    const links = this.props.links
    const linkListHeight = links.length * 48
    const listX = centered + offset - NODE_BUTTON_RADIUS
    const listY = centered - offset - NODE_BUTTON_RADIUS - linkListHeight - 10

    const { linksOpen } = this.state

    return (
      <g className='person-link'>
        <circle
          className={styles.linksIcon}
          cx={centered + offset}
          cy={centered - offset}
          fill={`url(#${LINK_BUTTON_PATTERN})`}
          r={NODE_BUTTON_RADIUS}
          onClick={this.handleToggleLinks}
        />

        {linksOpen && (
          <g transform={`translate(${listX},${listY})`}>
            <rect className={styles.linkList} width='198' height={linkListHeight} rx='3' ry='3' />

            {links.map((linkData, index) => {
              const { treeId, personId } = linkData
              return (
                <g
                  key={index}
                  className={styles.linkListItem}
                  transform={`translate(0,${48 * index})`}
                  onClick={() => this.goToTree(treeId, personId)}
                >
                  <rect width='198' height='48' rx='3' ry='3' />
                  <text className={styles.linkListText} transform='translate(10,30)'>{linkData.title}</text>
                </g>
              )
            })}
          </g>
        )}
      </g>
    )
  }
};

export default withRouter(PersonLinks)
