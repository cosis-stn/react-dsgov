import React, { useState } from 'react';
import { Button, Modal, Tab } from '../components';

const TabTests = () => {

    return (
        <>
            <Tab>
                <Tab.Content title="Sobre">
                    Painel Sobre
                </Tab.Content>
                <Tab.Content title="Todos">
                    Painel Todos
                </Tab.Content>
                <Tab.Content title="Notícias">
                    Painel Notícias
                </Tab.Content>
                <Tab.Content title="Serviços">
                    Painel Serviços
                </Tab.Content>
                <Tab.Content title="Aplicativos">
                    Painel Aplicativos
                </Tab.Content>
                <Tab.Content title="Mídias">
                    Painel Mídias
                </Tab.Content>
            </Tab>

            <Tab>
                <Tab.Content title="Sobre" icon="fas fa-image">
                    Painel Sobre
                </Tab.Content>
                <Tab.Content title="Todos" icon="fas fa-image">
                    Painel Todos
                </Tab.Content>
                <Tab.Content title="Notícias" icon="fas fa-image">
                    Painel Notícias
                </Tab.Content>
                <Tab.Content title="Serviços" icon="fas fa-image">
                    Painel Serviços
                </Tab.Content>
                <Tab.Content title="Aplicativos" icon="fas fa-image">
                    Painel Aplicativos
                </Tab.Content>
                <Tab.Content title="Mídias" icon="fas fa-image">
                    Painel Mídias
                </Tab.Content>
            </Tab>

            <Tab>
                <Tab.Content title="Sobre" subTitle='(124)'>
                    Painel Sobre
                </Tab.Content>
                <Tab.Content title="Todos" subTitle='(74)'>
                    Painel Todos
                </Tab.Content>
                <Tab.Content title="Notícias" subTitle='(16)'>
                    Painel Notícias
                </Tab.Content>
                <Tab.Content title="Aplicativos" subTitle='(12)'>
                    Painel Aplicativos
                </Tab.Content>
            </Tab>
        </>
        
    );
};

export default TabTests;