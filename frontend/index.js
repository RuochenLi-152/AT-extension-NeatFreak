import {
    initializeBlock,
    useBase,
    useRecords,
    TablePickerSynced,
    FieldPickerSynced,
    Button,
    Box,
    Text,
    useGlobalConfig,
    Loader,
} from '@airtable/blocks/ui';
import React, { useState } from 'react';

function NeatFreakApp() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const [isLoading, setIsLoading] = useState(false);

    const tableId = globalConfig.get('selectedTableId');
    const fieldId = globalConfig.get('selectedFieldId');

    const table = base.getTableByIdIfExists(tableId);
    const field = table?.getFieldByIdIfExists(fieldId);
    const records = useRecords(table);

    const isValid = table && field && field.type === 'multipleSelects';

    const sortOptions = async () => {
        setIsLoading(true);

        try {
            if (!isValid) return;
            const optionsOrder = field.options.choices.map(choice => choice.name);
    
            for (let record of records) {
                const current = record.getCellValue(field);
                if (Array.isArray(current)) {
                    const sorted = [...current].sort((a, b) =>
                        optionsOrder.indexOf(a.name) - optionsOrder.indexOf(b.name)
                    );
                    await table.updateRecordAsync(record.id, {
                        [field.id]: sorted
                    });
                }
            }
            alert('All tidy!');
        } catch (error) {
            console.error("Error during import:", error);
            alert("An error occurred. Check the console for details.");
        }
    };

    const resetSelections = async () => {
        await globalConfig.setAsync('selectedTableId', null);
        await globalConfig.setAsync('selectedFieldId', null);
    };

    return (
        <Box padding={3}>
            <Text fontWeight= {'bold'} fontSize={4} marginBottom={2}>
                NeatFreak - Help neat freaks to make their fields look nice!
            </Text>

            <Text>Select a table:</Text>
            <TablePickerSynced globalConfigKey="selectedTableId" />

            {table && (
                <>
                    <Text marginTop={3}>Select a multiple-select field:</Text>
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey="selectedFieldId"
                        allowedTypes={['multipleSelects']}
                    />
                </>
            )}

            <Box marginTop={4} display="flex" gap="10px">
                {isValid && (
                    <Button icon="sort" variant="primary" onClick={sortOptions}>
                        Sort Selected Options
                    </Button>
                )}
                <Button icon="x" variant="danger" onClick={resetSelections}>
                    Reset
                </Button>
            </Box>
        </Box>
    );
}

initializeBlock(() => <NeatFreakApp />);
