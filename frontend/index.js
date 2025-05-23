import {
    initializeBlock,
    useBase,
    useRecords,
    TablePickerSynced,
    Select,
    Button,
    Box,
    Text,
    useGlobalConfig,
    Loader,
    useWatchable,
} from '@airtable/blocks/ui';
import React, { useState, useEffect } from 'react';

function NeatFreakApp() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    const tableId = globalConfig.get('selectedTableId');
    const table = base.getTableByIdIfExists(tableId);

    useWatchable(table, ['fields']);

    const records = useRecords(table);

    useEffect(() => {
        if (table) {
            const availableFields = table.fields.filter(f => f.type === 'multipleSelects');
            if (availableFields.length === 1) {
                const autoField = availableFields[0];
                setSelectedField(autoField);
                globalConfig.setAsync('selectedFieldId', autoField.id);
            }
        }
    }, [table]);

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
            console.error("Error during sort:", error);
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

    const multipleSelectFields = table?.fields.filter(f => f.type === 'multipleSelects') ?? [];

    return (
        <Box padding={3}>
            <Box
                marginBottom={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                borderBottom="thick"
                paddingBottom={2}
            >
                <Text fontSize={5} fontWeight="bold" marginBottom={2}>
                    NeatFreak
                </Text>
                <Text fontSize={2} textAlign="center" textColor="light">
                    Tidy up your multi-select fields with just one click
                </Text>
            </Box>


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
                <Select
                    options={multipleSelectFields.map(f => ({
                        value: f.id,
                        label: f.name,
                    }))}
                    value={selectedField?.id ?? null}
                    onChange={(newId) => {
                        const newField = table.getFieldByIdIfExists(newId);
                        setSelectedField(newField);
                        globalConfig.setAsync('selectedFieldId', newId);
                    }}
                    placeholder="Choose your mess to clean up"
                    disabled={multipleSelectFields.length === 0}
                />
            </>
            )}

            <Box marginTop={4} display="flex" gap="10px">
                {isValid && (
                    <Button icon="sort" variant="primary" onClick={sortOptions}>
                        Sort
                    </Button>
                )}
                <Button marginLeft={2} icon="x" variant="danger" onClick={resetSelections}>
                    Reset
                </Button>
            </Box>
        </Box>
    );
}

initializeBlock(() => <NeatFreakApp />);
