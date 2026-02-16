import { useRef, useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useTutorial = () => {
    const driverObj = useRef<ReturnType<typeof driver>>(null);

    useEffect(() => {
        driverObj.current = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            doneBtnText: 'Listo',
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
            progressText: 'Paso {{current}} de {{total}}',
            popoverClass: 'driverjs-theme',
            steps: [
                { 
                    element: '#sidebar-item-personalizados', 
                    popover: { 
                        title: 'Fórmulas', 
                        description: 'Acceda a todas sus recetas y mezclas guardadas anteriormente.' 
                    } 
                },
                { 
                    element: '#sidebar-item-color_picker', 
                    popover: { 
                        title: 'Igualación', 
                        description: 'Herramienta para seleccionar un color y encontrar componentes cercanos.' 
                    } 
                },
                { 
                    element: '#sidebar-item-bases_auto', 
                    popover: { 
                        title: 'Línea Automotriz', 
                        description: 'Bases poliéster, esmaltes y productos específicos para vehículos.' 
                    } 
                },
                { 
                    element: '#sidebar-item-bases_arq', 
                    popover: { 
                        title: 'Línea Arquitectónica', 
                        description: 'Bases de caucho (Tipos A, B, C) para pintura de paredes y estructuras.' 
                    } 
                },
                { 
                    element: '#sidebar-item-tintes', 
                    popover: { 
                        title: 'Tintes y Pigmentos', 
                        description: 'Colección completa de tintes universales y perlas para dar color.' 
                    } 
                },
                { 
                    element: '#sidebar-item-barnices_acabados', 
                    popover: { 
                        title: 'Barnices y Acabados', 
                        description: 'Barnices (Skylack) y recubrimientos finales para protección y brillo.' 
                    } 
                },
                { 
                    element: '#sidebar-item-solventes', 
                    popover: { 
                        title: 'Solventes', 
                        description: 'Agregue solventes, diluyentes y otros químicos necesarios para la mezcla.' 
                    } 
                },
                { 
                    element: '#sidebar-item-envases', 
                    popover: { 
                        title: 'Envases', 
                        description: 'Seleccione el tipo y tamaño del contenedor para su producto final.' 
                    } 
                },
                { 
                    element: '#sidebar-item-complementos', 
                    popover: { 
                        title: 'Extras y Complementos', 
                        description: 'Añada complementos adicionales como lijas, cintas, primers y aditivos.' 
                    } 
                },
                { 
                    element: '#sidebar-management', 
                    popover: { 
                        title: 'Gestión de Inventario', 
                        description: 'Haga clic aquí para gestionar su inventario, agregar productos y ver existencias.' 
                    } 
                },
                { 
                    element: '#mixer-search', 
                    popover: { 
                        title: 'Búsqueda de Clientes', 
                        description: 'Ingrese el nombre del cliente y el color aquí para mantener un registro de sus mezclas.' 
                    } 
                },
                { 
                    element: '#product-grid-area', 
                    popover: { 
                        title: 'Selección de Productos', 
                        description: 'Haga clic en cualquier producto para agregarlo a la mezcla. Si es una fórmula guardada, verá una vista previa.' 
                    } 
                },
                { 
                    element: '#mix-summary', 
                    popover: { 
                        title: 'Resumen de Mezcla', 
                        description: 'Aquí verá todos los componentes de su mezcla actual. Puede ajustar cantidades o eliminar elementos antes de finalizar.' 
                    } 
                },
                { 
                    element: '#mix-summary-total', 
                    popover: { 
                        title: 'Total y Finalización', 
                        description: 'Verifique el costo total y presione "Verificar Orden" para guardar la fórmula y descontar del inventario.' 
                    } 
                },
            ]
        });
    }, []);

    const startTutorial = () => {
        driverObj.current?.drive();
    };

    return { startTutorial };
};
