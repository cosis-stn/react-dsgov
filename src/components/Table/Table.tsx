import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import IMtProps from "../IMtProps";
import { useSpreadProps } from "../Util/useSpreadProps";
import { useMtProps } from "../Util/useMtProps";
import List from "../List";
import Button from "../Button";
import Input from "../Input";
import Divider from "../Divider";
import Select from "../Select";
import { updateQueryStringParameter } from "../Util/Util";
import { SelectOptions } from "../Select/Select";

interface IHeader {
    field: string,
    label: string
}

interface IData {
    pageNumber?: number,
    recordCount?: number,
    pageSize?: number,
    records: any[]
}


interface TableProps  extends React.HTMLAttributes<HTMLDivElement>, IMtProps {
    id: string,
    title?: string,
    showOptions?: boolean;
    showSearch?: boolean;
    onSearch?: () => void;
    showSelectedBar?: boolean;

    headers?: string[] | IHeader[];
    data?: IData | object[];

    endpoint?: string;

    onClickNextPage?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {}

    showPageSelector?: boolean;
} 

const Table = React.forwardRef<HTMLDivElement, TableProps>(
    ({
        className, 
        children, 
        id,
        title,
        showOptions = true,
        showSearch = true,
        onSearch = () => {},
        showSelectedBar = true,
        headers,
        data,
        endpoint,
        onClickNextPage = () => {},
        showPageSelector = false,
        ...props
    }, ref) => {
        const mtProps = useMtProps(props);
        const spreadProps = useSpreadProps(props);

        const [paginacao, setPaginacao] = useState<string>("10");
        const [pagina, setPagina] = useState<string>("1");
        const [tableData, setTableData] = useState<any[]>([]);
        const [defaultSearch, setDefaultSearch] = useState<string>("");

        const [atualizando, setAtualizando] = useState<boolean>(false);

        const [currentEndpoint, setCurrentEndpoint] = useState<string>("");

        const [pageNumber, setPageNumber] = useState<number>();
        const [pageSize, setPageSize] = useState<number>();
        const [recordCount, setRecordCount] = useState<number>();

        const [pageOptions, setPageOptions] = useState<SelectOptions[]>();

        const pageCount = useRef<number | null>(null);

        const handleClickNextPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            onClickNextPage(event);
            
            if(!atualizando) {
                setPageNumber((currentOffset) => {
                    if(typeof currentOffset !== 'undefined') {
                        return currentOffset + 1;
                    } else {
                        return currentOffset;
                    }                
                })
            }
            
        }

        const handleClickPreviousPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            onClickNextPage(event);
            if(!atualizando) {
                setPageNumber((currentOffset) => {
                    if(typeof currentOffset !== 'undefined') {
                        return currentOffset - 1;
                    } else {
                        return currentOffset;
                    }                
                })
            }
            
        }

        const handleTrocaBuscaPadrao = () => {
            defaultSearch !== undefined && defaultSearch !== "" && setCurrentEndpoint((currentEndpoint) => 
                updateQueryStringParameter(currentEndpoint, 'defaultSearch', String(defaultSearch)));
        }


        useEffect(() => {
            // Se os dados tiverem sido informados manualmente, informa-os
            if(data && (data as IData).records) {
                setTableData((data as IData).records);

                setPageNumber((data as IData).pageNumber);
                setPageSize((data as IData).pageSize);
                setRecordCount((data as IData).recordCount);
            } else if(data) {
                const dataLength = (data as any[]).length;

                setTableData(data as any[]);
                setRecordCount(dataLength);
                setPageSize(dataLength);
                setPageNumber(0);
            }

            // Do contrário, seta os obtidos do endpoint
            if(endpoint) {
                setCurrentEndpoint(endpoint);
            }
                        
        }, [data, endpoint])

        // Ao trocar o endpoint, recarregar os dados
        useEffect(() => {
            if(currentEndpoint) {
                console.log(currentEndpoint);
                setAtualizando(true);
                fetch(currentEndpoint).then(res => {
                    res.json().then(json => {
                        if(json?.records) {
                            setTableData(json.records);
                        }
    
                        setPageNumber(json?.pageNumber);
                        setPageSize(json?.pageSize);                       
                        setRecordCount(json?.recordCount);

                        setAtualizando(false);
                    });
                })
            }
            
        }, [currentEndpoint]);
        
    // Ao trocar a página, recarregar os dados
    useEffect(() => {
        pageNumber !== undefined && setCurrentEndpoint((currentEndpoint) => 
                updateQueryStringParameter(currentEndpoint, 'pageNumber', String(pageNumber)))
    }, [pageNumber]);

    // Ao trocar o tamanho da página
    useEffect(() => {
        pageSize !== undefined && setCurrentEndpoint((currentEndpoint) => 
                updateQueryStringParameter(currentEndpoint, 'pageSize', String(pageSize)));
    }, [pageSize]);

    

    // Ao mudar a quantidade de registros ou o tamanho da página
    useEffect(() => {
        if(recordCount !== undefined && pageSize !== undefined) {
            const currentPageCount = Math.ceil(recordCount/pageSize);
            if(currentPageCount !== pageCount.current) {
                pageCount.current = currentPageCount;

                setPageOptions(pageOptions => {
                    if(pageOptions?.length !== pageSize) {
                        const currentPageOptions = [];
                        

                        for(let i = 0; i < currentPageCount; i++) {
                            currentPageOptions.push(
                                {
                                    label: String(i+1),
                                    value: String(i+1)
                                }
                            )
                        }
                        return currentPageOptions;
                    } else {
                        return pageOptions;
                    }
        
                })
            }
        }
        
    }, [recordCount, pageSize])
        

        return (
            <div
                ref={ref}
                className={classNames(
                    "br-table",
                    className,
                    ...mtProps
                )}
                {...spreadProps}
                data-search="data-search" 
                data-selection="data-selection" 
                data-collapse="data-collapse" 
                data-random="data-random"
                
            >
                <div className="table-header">
                    <div className="top-bar">
                    <div className="table-title">{title}</div>
                    <div className="actions-trigger text-nowrap">
                        <Button circle title="Ver mais opções" data-toggle="dropdown" data-target={`ver-mais-opcoes____${id}`} aria-label="Ver mais opções" icon="fas fa-ellipsis-v" />
                        <List className="br-list" id={`ver-mais-opcoes____${id}`} hidden role="">
                            <Button data-density="small">Densidade alta
                            </Button><span className="br-divider"></span>
                            <Button data-density="medium">Densidade média
                            </Button><span className="br-divider"></span>
                            <Button data-density="large">Densidade baixa
                            </Button>
                        </List>
                    </div>
                    <div className="search-trigger">
                        <Button circle data-toggle="search" aria-label="Abrir busca"><i className="fas fa-search" aria-hidden="true"></i>
                        </Button>
                    </div>
                    </div>
                    <div className="search-bar">
                    <div className="br-input">
                        <Input 
                            id={`table-searchbox-${id}`} 
                            label="Buscar" 
                            placeholder="Buscar na tabela" 
                            value={defaultSearch}
                            onChange={(event) => setDefaultSearch(event.currentTarget.value)}
                            button={<Button circle aria-label="Buscar" icon="fas fa-search" onClick={() => handleTrocaBuscaPadrao()} />}/>
                        
                    </div>
                    <Button circle data-dismiss="search" aria-label="Fechar busca" icon="fas fa-times" />
                    </div>
                    <div className="selected-bar">
                    <div className="info"><span className="count">0</span><span className="text">item selecionado</span></div>
                    <div className="actions-trigger text-nowrap">
                        <Button circle inverted type="button" data-toggle="dropdown" data-target={`target02-${id}`} aria-label="Ver mais opções" icon="fas fa-ellipsis-v" />
                        <List id={`target02-${id}`} hidden>
                            <Button data-toggle="">Ação 1</Button>
                            <Divider />
                            <Button>Ação 2</Button>
                        </List>
                    </div>
                    </div>
                </div>
                <table>
                    <caption>{title}</caption>
                    {headers && 
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{(header as IHeader).label || (header as string)}</th>
                                ))}
                            </tr>
                        </thead>
                    }
                    {tableData && !(headers as IHeader[])[0].label &&
                        <tbody>
                            {tableData.map((linha, index) => (
                                <tr key={linha}>
                                    {Object.keys(linha).map((key : string) => (
                                      <td key={key}>
                                        {linha[key]}
                                      </td>  
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    }
                    {tableData && (headers as IHeader[])[0].label &&
                        <tbody>
                            {tableData.map((linha, index) => (
                                <tr key={index}>
                                    {(headers as IHeader[]).map((header : IHeader, index : number) => (
                                      <td key={index}>
                                        {linha[header.field]}
                                      </td>  
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    }
                    
                    {children}
                </table>
                <div className="table-footer">
                    <nav className="br-pagination" aria-label="Paginação de resultados" data-total="50" data-current="1" data-per-page="20">
                    <div className="pagination-per-page">
                        <Select label="Itens por página" id={`per-page-selection-random-${id}`} options={[
                            {label: "10", value: "10"},
                            {label: "20", value: "20"},
                            {label: "30", value: "30"}
                        ]}
                        onChange={(value : any) => setPageSize(value)}
                        value={pageSize}
                        />
                    </div><span className="br-divider d-none d-sm-block mx-3"></span>
                    <div className="pagination-information d-none d-sm-flex"><span className="current">{pageNumber != null && pageSize != null && pageNumber*pageSize+1}</span>&ndash;<span className="per-page">{pageNumber != null && pageSize != null && pageNumber*pageSize+pageSize}</span>&nbsp;de&nbsp;<span className="total">{recordCount}</span>&nbsp;itens</div>
                    <div className="pagination-go-to-page d-none d-sm-flex ml-auto">
                        {showPageSelector &&
                        <Select id={`go-to-selection-random-75889`} options={pageOptions || []}
                         onChange={(valor : string) => setPageNumber(Number(valor)-1)} value={pageNumber} />}
                    </div><span className="br-divider d-none d-sm-block mx-3"></span>
                    <div className="pagination-arrows ml-auto ml-sm-0">
                        <Button circle aria-label="Voltar página" icon="fas fa-angle-left" disabled={pageNumber === 0} onClick={(event) => handleClickPreviousPage(event)}/>
                        <Button circle data-total={pageCount.current} aria-label="Avançar página" icon="fas fa-angle-right" data-pageNumber={pageNumber} disabled={pageNumber === ((pageCount.current || 0) - 1)} onClick={(event) => handleClickNextPage(event)} />
                    </div>
                    </nav>
                </div>
            </div>
        );
    }
) 

export default Table;