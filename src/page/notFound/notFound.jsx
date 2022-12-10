import React from 'react'
import { useEffect } from 'react';
import classes from '../../App.module.scss';

function NotFound() {

    useEffect(()=>{
        document.title="صفحه مورد نظر پیدا نشد"
    },[])

    return (
        <div className={classes.appContainer}>
            <div className={classes.container}>
                
                <h2 className={classes.notFound__title}>صفحه پیدا نشد</h2>
            </div>
        </div>
    )
}

export default NotFound