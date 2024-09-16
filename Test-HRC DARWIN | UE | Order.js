/** 
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 By Darwin M.
 */


define(['N/record', 'N/log', 'N/error', 'N/ui/dialog', 'N/ui/message'],
    function (record, log, error, dialog, message) {

        function myBeforeSubmit(scrtcontext) {
            
            if (scrtcontext.type !== scrtcontext.UserEventType.CREATE)
                return;
            
            var memoVal = memoIsValid(scrtcontext.newRecord);
            var memoValErr = "";
            var custPhoneOK = customerIsValid(scrtcontext.newRecord);
            var custPhoneOKErr = ""
            var itemsOK = itemsCountOK(scrtcontext.newRecord);
            var itemsOKErr = "";
            var quantityCount = quantityCountOK(scrtcontext.newRecord, itemsOK, 5);
            var quantityCountErr = "";

            log.debug({ "title": "Before sutmit", "details": "Action: " + scrtcontext.type });

            if (memoVal) {
                log.debug({ "title": "Before sutmit", "details": "Memo is test OK" });
            } else {
                memoValErr = " El field del header Memo no contiene la palabra test ";

            }

            if (custPhoneOK) {
                log.debug({ "title": "Before sutmit", "details": "Customer is OK" });
            } else {
                custPhoneOKErr = " El customer seleccionado NO tiene teléfono ";
            }

            if (itemsOK >= 2) {
                log.debug({ "title": "Before sutmit", "details": "Items are OK" });
            } else {
                itemsOKErr = " La lista de Items es menor a dos ";
            }

            if (quantityCount) {
                log.debug({ "title": "Before sutmit", "details": "Quantity Count is OK" });
            } else {
                quantityCountErr = " La cantidad de los items (quantity) en la orden en cada linea es menor a 5 ";
            }


            if (memoVal && custPhoneOK && itemsOK >= 2 && quantityCount) {
                log.debug({ "title": "Before sutmit", "details": "Se cumplen las condiciones solicitadas" });
                alert("Se cumplen las condiciones solicitadas");
                dialog.confirm({
                    title: "Se cumplen las condiciones solicitadas",
                    message: "Se cumplen las condiciones solicitadas"
                });
            } else {
                log.debug({ "title": "Before sutmit", "details": "NO Se cumplen las condiciones solicitadas" });
                throw error.create({
                    "name": "ERROR_INVALID_DATA",
                    "message": "Validar los siguientes datos:" + memoValErr + custPhoneOKErr + itemsOKErr + quantityCountErr,
                    "notifyOff": true
                });
            }

        }

        function myBeforeLoad(scrtcontext) {
            if (scrtcontext.type !== scrtcontext.UserEventType.VIEW)
                return;
            log.debug({ "title": "Before Load", "details": "Action: " + scrtcontext.type });
            var myMsg = message.create({
                title: "Se cumplen las condiciones solicitadas",
                message: "Se cumplen las condiciones solicitadas",
                type: message.Type.CONFIRMATION,
                duration: 1500
            });

            myMsg.show();

        }

        function memoIsValid(salesOrder) {
            var labelMemoValue = salesOrder.getValue({ "fieldId": "memo" });
            return (labelMemoValue.search("test") >= 0);
        }

        function customerIsValid(customer) {
            var customerPhone = customer.getValue({ "fieldId": "custbody1" });
            return (Boolean(customerPhone));
        }

        function itemsCountOK(itemsPerOrder) {
            var itemsinOrder = itemsPerOrder.getLineCount({ "sublistId": "item" });
            return itemsinOrder;
        }

        function quantityCountOK(quantityItemsPerOrder, itemCount, reqQuantity) {
            var countOK = 0;
            var itemCount = itemCount;

            for (var i = 0; i < itemCount; i++) {
                var itemQuantity = quantityItemsPerOrder.getSublistValue({
                    "sublistId": "item",
                    "fieldId": "quantity",
                    "line": i
                });

                if (itemQuantity >= reqQuantity)
                    countOK++;
            }

            return (countOK == itemCount);

        }


        return {
            beforeLoad: myBeforeLoad,
            beforeSubmit: myBeforeSubmit
        };

    });





