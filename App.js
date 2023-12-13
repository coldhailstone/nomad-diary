import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import Realm from 'realm';
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
    const startLoading = async () => {
        const realm = await Realm.open({
            path: 'nomadDiaryDB',
            schema: [FeelingSchema],
        });
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
        <NavigationContainer onReady={onLayoutRootView}>
            <Navigator />
        </NavigationContainer>
    );
}
