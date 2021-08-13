import React, { Component, Fragment } from 'react';
import { } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class WGLoader extends Component {

    state={
        loading:this.props.loading
    }
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {
        return (
            <svg style={this.props.style} onClick={()=>this.setState({loading:!this.state.loading})} id="wgloader" className={(this.state.loading ? "loading" : "")} viewBox="0 0 346 343" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="text">
                    <path id="senges" d="M77.3949 185.42C75.4583 185.42 73.5799 185.163 71.7599 184.65C69.9633 184.113 68.5166 183.425 67.4199 182.585L69.3449 178.315C70.3949 179.085 71.6433 179.703 73.0899 180.17C74.5366 180.637 75.9833 180.87 77.4299 180.87C79.0399 180.87 80.2299 180.637 80.9999 180.17C81.7699 179.68 82.1549 179.038 82.1549 178.245C82.1549 177.662 81.9216 177.183 81.4549 176.81C81.0116 176.413 80.4283 176.098 79.7049 175.865C79.0049 175.632 78.0483 175.375 76.8349 175.095C74.9683 174.652 73.4399 174.208 72.2499 173.765C71.0599 173.322 70.0333 172.61 69.1699 171.63C68.3299 170.65 67.9099 169.343 67.9099 167.71C67.9099 166.287 68.2949 165.003 69.0649 163.86C69.8349 162.693 70.9899 161.772 72.5299 161.095C74.0933 160.418 75.9949 160.08 78.2349 160.08C79.7983 160.08 81.3266 160.267 82.8199 160.64C84.3133 161.013 85.6199 161.55 86.7399 162.25L84.9899 166.555C82.7266 165.272 80.4633 164.63 78.1999 164.63C76.6133 164.63 75.4349 164.887 74.6649 165.4C73.9183 165.913 73.5449 166.59 73.5449 167.43C73.5449 168.27 73.9766 168.9 74.8399 169.32C75.7266 169.717 77.0683 170.113 78.8649 170.51C80.7316 170.953 82.2599 171.397 83.4499 171.84C84.6399 172.283 85.6549 172.983 86.4949 173.94C87.3583 174.897 87.7899 176.192 87.7899 177.825C87.7899 179.225 87.3933 180.508 86.5999 181.675C85.8299 182.818 84.6633 183.728 83.0999 184.405C81.5366 185.082 79.6349 185.42 77.3949 185.42ZM115.884 180.45V185H96.9143V160.5H115.429V165.05H102.549V170.37H113.924V174.78H102.549V180.45H115.884ZM148.116 160.5V185H143.461L131.246 170.125V185H125.646V160.5H130.336L142.516 175.375V160.5H148.116ZM175.717 172.365H180.897V182.305C179.567 183.308 178.027 184.078 176.277 184.615C174.527 185.152 172.766 185.42 170.992 185.42C168.449 185.42 166.162 184.883 164.132 183.81C162.102 182.713 160.504 181.208 159.337 179.295C158.194 177.358 157.622 175.177 157.622 172.75C157.622 170.323 158.194 168.153 159.337 166.24C160.504 164.303 162.114 162.798 164.167 161.725C166.221 160.628 168.531 160.08 171.097 160.08C173.244 160.08 175.192 160.442 176.942 161.165C178.692 161.888 180.162 162.938 181.352 164.315L177.712 167.675C175.962 165.832 173.851 164.91 171.377 164.91C169.814 164.91 168.426 165.237 167.212 165.89C165.999 166.543 165.054 167.465 164.377 168.655C163.701 169.845 163.362 171.21 163.362 172.75C163.362 174.267 163.701 175.62 164.377 176.81C165.054 178 165.987 178.933 167.177 179.61C168.391 180.263 169.767 180.59 171.307 180.59C172.941 180.59 174.411 180.24 175.717 179.54V172.365ZM210.384 180.45V185H191.414V160.5H209.929V165.05H197.049V170.37H208.424V174.78H197.049V180.45H210.384ZM228.196 185.42C226.259 185.42 224.381 185.163 222.561 184.65C220.764 184.113 219.317 183.425 218.221 182.585L220.146 178.315C221.196 179.085 222.444 179.703 223.891 180.17C225.337 180.637 226.784 180.87 228.231 180.87C229.841 180.87 231.031 180.637 231.801 180.17C232.571 179.68 232.956 179.038 232.956 178.245C232.956 177.662 232.722 177.183 232.256 176.81C231.812 176.413 231.229 176.098 230.506 175.865C229.806 175.632 228.849 175.375 227.636 175.095C225.769 174.652 224.241 174.208 223.051 173.765C221.861 173.322 220.834 172.61 219.971 171.63C219.131 170.65 218.711 169.343 218.711 167.71C218.711 166.287 219.096 165.003 219.866 163.86C220.636 162.693 221.791 161.772 223.331 161.095C224.894 160.418 226.796 160.08 229.036 160.08C230.599 160.08 232.127 160.267 233.621 160.64C235.114 161.013 236.421 161.55 237.541 162.25L235.791 166.555C233.527 165.272 231.264 164.63 229.001 164.63C227.414 164.63 226.236 164.887 225.466 165.4C224.719 165.913 224.346 166.59 224.346 167.43C224.346 168.27 224.777 168.9 225.641 169.32C226.527 169.717 227.869 170.113 229.666 170.51C231.532 170.953 233.061 171.397 234.251 171.84C235.441 172.283 236.456 172.983 237.296 173.94C238.159 174.897 238.591 176.192 238.591 177.825C238.591 179.225 238.194 180.508 237.401 181.675C236.631 182.818 235.464 183.728 233.901 184.405C232.337 185.082 230.436 185.42 228.196 185.42Z"/>
                    <path id="wg" d="M119.428 192.6L116.68 201H114.592L112.744 195.312L110.836 201H108.76L106 192.6H108.016L109.912 198.504L111.892 192.6H113.692L115.612 198.552L117.568 192.6H119.428ZM122.848 201.096C122.52 201.096 122.244 200.984 122.02 200.76C121.796 200.536 121.684 200.256 121.684 199.92C121.684 199.576 121.796 199.3 122.02 199.092C122.244 198.876 122.52 198.768 122.848 198.768C123.176 198.768 123.452 198.876 123.676 199.092C123.9 199.3 124.012 199.576 124.012 199.92C124.012 200.256 123.9 200.536 123.676 200.76C123.452 200.984 123.176 201.096 122.848 201.096ZM132.894 196.668H134.67V200.076C134.214 200.42 133.686 200.684 133.086 200.868C132.486 201.052 131.882 201.144 131.274 201.144C130.402 201.144 129.618 200.96 128.922 200.592C128.226 200.216 127.678 199.7 127.278 199.044C126.886 198.38 126.69 197.632 126.69 196.8C126.69 195.968 126.886 195.224 127.278 194.568C127.678 193.904 128.23 193.388 128.934 193.02C129.638 192.644 130.43 192.456 131.31 192.456C132.046 192.456 132.714 192.58 133.314 192.828C133.914 193.076 134.418 193.436 134.826 193.908L133.578 195.06C132.978 194.428 132.254 194.112 131.406 194.112C130.87 194.112 130.394 194.224 129.978 194.448C129.562 194.672 129.238 194.988 129.006 195.396C128.774 195.804 128.658 196.272 128.658 196.8C128.658 197.32 128.774 197.784 129.006 198.192C129.238 198.6 129.558 198.92 129.966 199.152C130.382 199.376 130.854 199.488 131.382 199.488C131.942 199.488 132.446 199.368 132.894 199.128V196.668ZM143.955 192.6H145.899V199.416H150.111V201H143.955V192.6ZM157.164 201.144C156.292 201.144 155.504 200.956 154.8 200.58C154.104 200.204 153.556 199.688 153.156 199.032C152.764 198.368 152.568 197.624 152.568 196.8C152.568 195.976 152.764 195.236 153.156 194.58C153.556 193.916 154.104 193.396 154.8 193.02C155.504 192.644 156.292 192.456 157.164 192.456C158.036 192.456 158.82 192.644 159.516 193.02C160.212 193.396 160.76 193.916 161.16 194.58C161.56 195.236 161.76 195.976 161.76 196.8C161.76 197.624 161.56 198.368 161.16 199.032C160.76 199.688 160.212 200.204 159.516 200.58C158.82 200.956 158.036 201.144 157.164 201.144ZM157.164 199.488C157.66 199.488 158.108 199.376 158.508 199.152C158.908 198.92 159.22 198.6 159.444 198.192C159.676 197.784 159.792 197.32 159.792 196.8C159.792 196.28 159.676 195.816 159.444 195.408C159.22 195 158.908 194.684 158.508 194.46C158.108 194.228 157.66 194.112 157.164 194.112C156.668 194.112 156.22 194.228 155.82 194.46C155.42 194.684 155.104 195 154.872 195.408C154.648 195.816 154.536 196.28 154.536 196.8C154.536 197.32 154.648 197.784 154.872 198.192C155.104 198.6 155.42 198.92 155.82 199.152C156.22 199.376 156.668 199.488 157.164 199.488ZM170.937 196.668H172.713V200.076C172.257 200.42 171.729 200.684 171.129 200.868C170.529 201.052 169.925 201.144 169.317 201.144C168.445 201.144 167.661 200.96 166.965 200.592C166.269 200.216 165.721 199.7 165.321 199.044C164.929 198.38 164.733 197.632 164.733 196.8C164.733 195.968 164.929 195.224 165.321 194.568C165.721 193.904 166.273 193.388 166.977 193.02C167.681 192.644 168.473 192.456 169.353 192.456C170.089 192.456 170.757 192.58 171.357 192.828C171.957 193.076 172.461 193.436 172.869 193.908L171.621 195.06C171.021 194.428 170.297 194.112 169.449 194.112C168.913 194.112 168.437 194.224 168.021 194.448C167.605 194.672 167.281 194.988 167.049 195.396C166.817 195.804 166.701 196.272 166.701 196.8C166.701 197.32 166.817 197.784 167.049 198.192C167.281 198.6 167.601 198.92 168.009 199.152C168.425 199.376 168.897 199.488 169.425 199.488C169.985 199.488 170.489 199.368 170.937 199.128V196.668ZM176.559 192.6H178.503V201H176.559V192.6ZM185.296 201.144C184.632 201.144 183.988 201.056 183.364 200.88C182.748 200.696 182.252 200.46 181.876 200.172L182.536 198.708C182.896 198.972 183.324 199.184 183.82 199.344C184.316 199.504 184.812 199.584 185.308 199.584C185.86 199.584 186.268 199.504 186.532 199.344C186.796 199.176 186.928 198.956 186.928 198.684C186.928 198.484 186.848 198.32 186.688 198.192C186.536 198.056 186.336 197.948 186.088 197.868C185.848 197.788 185.52 197.7 185.104 197.604C184.464 197.452 183.94 197.3 183.532 197.148C183.124 196.996 182.772 196.752 182.476 196.416C182.188 196.08 182.044 195.632 182.044 195.072C182.044 194.584 182.176 194.144 182.44 193.752C182.704 193.352 183.1 193.036 183.628 192.804C184.164 192.572 184.816 192.456 185.584 192.456C186.12 192.456 186.644 192.52 187.156 192.648C187.668 192.776 188.116 192.96 188.5 193.2L187.9 194.676C187.124 194.236 186.348 194.016 185.572 194.016C185.028 194.016 184.624 194.104 184.36 194.28C184.104 194.456 183.976 194.688 183.976 194.976C183.976 195.264 184.124 195.48 184.42 195.624C184.724 195.76 185.184 195.896 185.8 196.032C186.44 196.184 186.964 196.336 187.372 196.488C187.78 196.64 188.128 196.88 188.416 197.208C188.712 197.536 188.86 197.98 188.86 198.54C188.86 199.02 188.724 199.46 188.452 199.86C188.188 200.252 187.788 200.564 187.252 200.796C186.716 201.028 186.064 201.144 185.296 201.144ZM193.852 194.184H191.164V192.6H198.484V194.184H195.796V201H193.852V194.184ZM201.57 192.6H203.514V201H201.57V192.6ZM216.631 201.9C216.359 202.236 216.027 202.492 215.635 202.668C215.251 202.844 214.827 202.932 214.363 202.932C213.739 202.932 213.175 202.796 212.671 202.524C212.167 202.26 211.591 201.788 210.943 201.108C210.183 201.012 209.503 200.768 208.903 200.376C208.311 199.984 207.847 199.48 207.511 198.864C207.183 198.24 207.019 197.552 207.019 196.8C207.019 195.976 207.215 195.236 207.607 194.58C208.007 193.916 208.555 193.396 209.251 193.02C209.955 192.644 210.743 192.456 211.615 192.456C212.487 192.456 213.271 192.644 213.967 193.02C214.663 193.396 215.211 193.916 215.611 194.58C216.011 195.236 216.211 195.976 216.211 196.8C216.211 197.776 215.935 198.632 215.383 199.368C214.839 200.104 214.115 200.616 213.211 200.904C213.411 201.112 213.603 201.26 213.787 201.348C213.979 201.444 214.183 201.492 214.399 201.492C214.919 201.492 215.375 201.284 215.767 200.868L216.631 201.9ZM208.987 196.8C208.987 197.32 209.099 197.784 209.323 198.192C209.555 198.6 209.871 198.92 210.271 199.152C210.671 199.376 211.119 199.488 211.615 199.488C212.111 199.488 212.559 199.376 212.959 199.152C213.359 198.92 213.671 198.6 213.895 198.192C214.127 197.784 214.243 197.32 214.243 196.8C214.243 196.28 214.127 195.816 213.895 195.408C213.671 195 213.359 194.684 212.959 194.46C212.559 194.228 212.111 194.112 211.615 194.112C211.119 194.112 210.671 194.228 210.271 194.46C209.871 194.684 209.555 195 209.323 195.408C209.099 195.816 208.987 196.28 208.987 196.8ZM223.444 201.144C222.244 201.144 221.308 200.812 220.636 200.148C219.972 199.484 219.64 198.536 219.64 197.304V192.6H221.584V197.232C221.584 198.736 222.208 199.488 223.456 199.488C224.064 199.488 224.528 199.308 224.848 198.948C225.168 198.58 225.328 198.008 225.328 197.232V192.6H227.248V197.304C227.248 198.536 226.912 199.484 226.24 200.148C225.576 200.812 224.644 201.144 223.444 201.144ZM237.713 199.44V201H231.209V192.6H237.557V194.16H233.141V195.984H237.041V197.496H233.141V199.44H237.713Z"/>
                </g>
                <g id="curves">
                    <path id="inner" d="M176 56C161.046 56 146.747 58.7815 133.601 63.8511L157.148 86.9352C164.121 85.0203 171.445 84 179 84C225.944 84 264 123.399 264 172C264 220.601 225.944 260 179 260C173.796 260 168.701 259.516 163.755 258.589L139.594 282.274C151.052 285.99 163.289 288 176 288C240.617 288 293 236.065 293 172C293 107.935 240.617 56 176 56Z" fill="white"/>
                    <path id="outter" d="M173 343C194.85 343 215.753 338.985 235.001 331.657L200.795 298.124C191.833 300.008 182.535 301 173 301C100.098 301 41 243.021 41 171.5C41 99.9791 100.098 42 173 42C178.571 42 184.062 42.3386 189.452 42.996L225.204 7.94638C208.732 2.78425 191.194 0 173 0C77.4547 0 0 76.7832 0 171.5C0 266.217 77.4547 343 173 343Z" fill="white"/>
                </g>
            </svg>
        )
    }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(WGLoader);