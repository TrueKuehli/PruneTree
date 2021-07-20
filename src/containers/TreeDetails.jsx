import { connect } from 'react-redux'
import TreeDetails from '../components/trees/TreeDetails'
import { addTree, updateTree } from './../redux/actions'

const mapStateToProps = state => {
  return {
    trees: state.usersTrees
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTree: tree => {
      dispatch(addTree(tree))
    },
    updateTree: tree => {
      dispatch(updateTree(tree))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeDetails)
