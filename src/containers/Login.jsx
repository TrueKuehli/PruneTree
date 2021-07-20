import { connect } from 'react-redux'
import Login from '../components/Login'
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
)(Login)
