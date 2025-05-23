import {
    initializeBlock,
    useBase,
    useRecords,
    TablePickerSynced,
    FieldPicker,
    Button,
    Box,
    Text,
    useGlobalConfig,
    Loader,
    useWatchable
} from '@airtable/blocks/ui';
import React, { useState, useEffect } from 'react';

function NeatFreakApp() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    const tableId = globalConfig.get('selectedTableId');
    const fieldId = globalConfig.get('selectedFieldId');

    const table = base.getTableByIdIfExists(tableId);

    // Ensure updates to table fields are reactive
    useWatchable(table, ['fields']);

    const records = useRecords(table);

    // Set initial field from global config
    useEffect(() => {
        if (table && fieldId) {
            const field = table.getFieldByIdIfExists(fieldId);
            if (field?.type === 'multipleSelects') {
                setSelectedField(field);
            }
        }
    }, [table, fieldId]);

    const isValid = table && selectedField && selectedField.type === 'multipleSelects';

    const sortOptions = async () => {
        setIsLoading(true);

        try {
            if (!isValid) return;

            const optionsOrder = selectedField.options.choices.map(choice => choice.name);

            for (let record of records) {
                const current = record.getCellValue(selectedField);
                if (Array.isArray(current)) {
                    const sorted = [...current].sort((a, b) =>
                        optionsOrder.indexOf(a.name) - optionsOrder.indexOf(b.name)
                    );
                    await table.updateRecordAsync(record.id, {
                        [selectedField.id]: sorted
                    });
                }
            }

            alert("You're all set, enjoy the sorted, clean look!");
        } catch (error) {
            console.error("Error during import:", error);
            alert("An error occurred. Check the console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetSelections = async () => {
        await globalConfig.setAsync('selectedTableId', null);
        await globalConfig.setAsync('selectedFieldId', null);
        setSelectedField(null);
    };

    const multipleSelectFields = table?.fields.filter(f => f.type === 'multipleSelects');

    return (
        <Box padding={3}>
            <Text fontWeight={'bold'} fontSize={4} marginBottom={3}>
                NeatFreak – Help neat freaks make their fields look nice!
            </Text>

            {isLoading && (
                <Box marginTop={3} marginBottom={3} display="flex" justifyContent="center">
                    <Loader scale={0.5} />
                </Box>
            )}

            <Text>Select a table:</Text>
            <TablePickerSynced globalConfigKey="selectedTableId" />

            {table && (
                <>
                    <Text marginTop={3}>Select a multiple-select field:</Text>
                    <FieldPicker
                        table={table}
                        field={selectedField}
                        allowedFieldIds={multipleSelectFields.map(f => f.id)}
                        onChange={(newField) => {
                            setSelectedField(newField);
                            globalConfig.setAsync('selectedFieldId', newField?.id ?? null);
                        }}
                    />
                </>
            )}

            <Box marginTop={4} display="flex" gap="10px">
                {isValid && (
                    <Button icon="sort" variant="primary" onClick={sortOptions}>
                        Sort
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
