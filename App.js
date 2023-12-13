import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import Realm from 'realm';
import { DBContext } from './context';
import Navigator from './navigator';

const FeelingSchema = {
    name: 'Feeling',
    properties: {
        _id: 'int',
        emotion: 'string',
        message: 'string',
    },
    primaryKey: '_id',
};

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [ready, setReady] = useState(false);
    const [realm, setRealm] = useState(null);
    const startLoading = async () => {
        const connection = await Realm.open({
            path: 'nomadDiaryDB',
            schema: [FeelingSchema],
        });
        setRealm(connection);
    };
    useEffect(() => {
        startLoading();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (ready) {
            await SplashScreen.hideAsync();
        }
    }, [ready]);

    return (
        <DBContext.Provider value={realm}>
            <NavigationContainer onReady={onLayoutRootView}>
                <Navigator />
            </NavigationContainer>
        </DBContext.Provider>
    );
}
