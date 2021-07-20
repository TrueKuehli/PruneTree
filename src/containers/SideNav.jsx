import { connect } from 'react-redux'
import SideNav from '../components/SideNav'
import { loadUsersTree } from './../redux/actions'

const mapStateToProps = state => {
  return {
    trees: state.usersTrees
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUsersTree: trees => {
      dispatch(loadUsersTree(trees))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideNav)
