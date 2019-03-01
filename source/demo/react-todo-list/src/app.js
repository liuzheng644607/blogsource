'use strict';

import React from 'react';
import ReactDom from 'react-dom';

// 最外层组件
class Todos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             todoList: JSON.parse(localStorage.getItem('todoList')) || [],
             isSelectedAll: false,
             showClass: 'all',
        };
    }
    addItem(item) {
        this.state.todoList.unshift(item);
        this.setState({
            todoList: this.state.todoList
        });
        this.refreshLocalData();
    }
    refreshLocalData() {
        var data = JSON.stringify(this.state.todoList);
        localStorage.setItem('todoList', data);
    }
    removeItemByIndex(index) {
        this.state.todoList.splice(index, 1);
        this.setState({
            todoList: this.state.todoList
        });
        this.refreshLocalData();
    }
    changeItemState(index, isDone) {
        this.state.todoList[index].isDone = isDone;
        this.setState({
            todoList: this.state.todoList
        }, function() {
            this.setState({
                selectedAll: !this.state.todoList.some((item) => item.isDone === false),
            });
        });
        this.refreshLocalData();
    }
    changeAllState(isSelecteAll) {
        this.state.todoList.forEach((item, index) => {
            this.state.todoList[index].isDone = isSelecteAll;
        });
        this.setState({
            todoList: this.state.todoList,
            selectedAll: isSelecteAll,
        });
        this.refreshLocalData();
    }
    changeClass(className) {
        this.setState({
            showClass: className
        });
    }
    removeSelected() {

        var activeItem = this.state.todoList.filter((item) => {
            return item.isDone !== true;
        });
        this.setState({
            todoList: activeItem,
        }, () => this.refreshLocalData());

    }
    render() {
        var leftCount = this.state.todoList.filter((item) => item.isDone === false).length || 0;
        return (
            <div>
                <InputBox selectedAll={this.state.selectedAll} changeAllState={this.changeAllState.bind(this)} submitHandler={this.addItem.bind(this)} />
                <div className={this.state.showClass}>
                    <TodoList dataList={this.state.todoList} changeItemState={this.changeItemState.bind(this)} removeItem={this.removeItemByIndex.bind(this)}/>
                </div>
                <div style={{display: this.state.todoList.length > 0 ? 'block' : 'none'}}>
                    <FooterBar leftCount={leftCount} removeSelected={this.removeSelected.bind(this)} changeClass={this.changeClass.bind(this)}/>
                </div>
            </div>
        );
    }
}

// 头部输入框
class InputBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            words: ''
        }
    }
    handerKeyDown(e) {
        if (e.keyCode === 13) {
            let text = this.state.words;
            if (text.trim() === '') return;
            let itemData = {
                text: text,
                isDone: false,
            };
            this.props.submitHandler(itemData);
            this.setState({
                words: ''
            }, function() {
                e.target.value = '';
            });
        }
    }
    handerChange(e) {
        this.setState({
            words: e.target.value
        });
    }
    handlerAllState(e){
        this.props.changeAllState(e.target.checked);
    }
    render() {
        return (
            <div>
                <input type='checkbox' onChange={this.handlerAllState.bind(this)} checked={this.props.selectedAll} />
                <input type='text' onChange={this.handerChange.bind(this)} onKeyDown={this.handerKeyDown.bind(this)} placeholder="今天做什么..." />
            </div>
        );
    }
}

// 底部操作条
class FooterBar extends React.Component {
    render() {
        return (
            <div className='footerbar'>
                <button onClick={() => this.props.changeClass('active-only')}>active</button>
                <button onClick={() => this.props.changeClass('all')}>all</button>
                <button onClick={() => this.props.changeClass('completed-only')}>completed</button>
                <button onClick={this.props.removeSelected}>clear completed</button>
                <span>left: {this.props.leftCount}</span>
            </div>
        );
    }
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let dataList = this.props.dataList.map((item, index) => {
            return <TodoItem className={item.isDone ? 'completed' : 'active'} key={index} index={index} {...item} {...this.props} />
        });
        return (
            <div>
                {dataList}
            </div>
        );
    }
}

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
    }
    handlerDeleteItem() {
        this.props.removeItem(this.props.index);
    }
    handlerChange(e) {
        let isComplete = e.target.checked;
        this.props.changeItemState(this.props.index, isComplete);
    }
    render() {
        return (
            <div className={this.props.className}>
                <input type="checkbox" onChange={this.handlerChange.bind(this)} checked={this.props.isDone}/>
                <span>
                    {this.props.text}
                </span>
                <span className="delete" onClick={this.handlerDeleteItem.bind(this)}>
                delete
                </span>
            </div>
        );
    }
}
ReactDom.render(
    <Todos />,
    document.querySelector('.container'),
)