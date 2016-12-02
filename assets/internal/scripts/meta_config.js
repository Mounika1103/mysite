$(document).ready(function () {
    $('form table td textarea').attr("rows", "1").addClass('ellipsis').dotdotdot({
		//	configuration goes here
	});;
    $('form table td textarea').on('focusin', function(){
      $(this).attr("rows", "10").removeClass('ellipsis');
    });
    $('form table td textarea').on('focusout', function(){
      $(this).attr("rows", "1").addClass('ellipsis');
    });
  // Meta Staging to Target Mapping
    $('#restore-sys-meta-stg-tgt-btn').on('click', function(){
        var client = $('#client').val();
        var code = 'META_STG_TGT_MAP';
        $.get('/vs/configs/restore_system/?client='+client+'&code='+code)
            .done(function (response) {
                console.log(code);
                var msg = "Meta Staging to Target Mapping configuration has been restored to System Default.";
                UIToastr.notify('success', 'Restored Successfully!', msg);
            });
    });

    $('#user-def-meta-stg-tgt-btn').on('click', function(){
        var form = $('#webclientform').serialize();
        var client = $('#client').val();
        $.post('/vs/configs/metastgtgtmap/?client='+client+'&setDef=true', form)
            .done(function (response) {
                var msg = "Meta Staging to Target Mapping (User Default Configuration) has been updated.";
                UIToastr.notify('success', 'Saved Successfully!', msg);
            });
    });

    $('#restore-user-def-meta-stg-tgt-btn').on('click', function(){
        var client = $('#client').val();
        var code = 'META_STG_TGT_MAP';
        $.get('/vs/configs/metastgtgtmap/?client='+client+'&code='+code+'&userDef=true')
            .done(function (response) {
                var msg = "Meta Staging to Target Mapping configuration has been restored to System Default.";
                UIToastr.notify('success', 'Restored Successfully!', msg);
            });
    });
    $('#show-db-meta-stg-tgt-btn').on('click', function(){
        var msg = "Meta Staging to Target Mapping Database Name";
        UIToastr.notify('success', 'META_STG_TGT_MAP', msg);
    });

    // Meta Source to Staging Mapping
      $('#restore-sys-meta-src-stg-btn').on('click', function(){
          var client = $('#client').val();
          var code = 'META_SRC_STG_MAP';
          $.get('/vs/configs/restore_system/?client='+client+'&code='+code)
              .done(function (response) {
                  console.log(code);
                  var msg = "Meta Source to Staging Mapping configuration has been restored to System Default.";
                  UIToastr.notify('success', 'Restored Successfully!', msg);
              });
      });

      $('#user-def-meta-src-stg-btn').on('click', function(){
          var form = $('#webclientform').serialize();
          var client = $('#client').val();
          $.post('/vs/configs/metasrcstgmap/?client='+client+'&setDef=true', form)
              .done(function (response) {
                  var msg = "Meta Source to Staging Mapping (User Default Configuration) has been updated.";
                  UIToastr.notify('success', 'Saved Successfully!', msg);
              });
      });

      $('#restore-user-def-meta-src-stg-btn').on('click', function(){
          var client = $('#client').val();
          var code = 'META_SRC_STG_MAP';
          $.get('/vs/configs/metasrcstgmap/?client='+client+'&code='+code+'&userDef=true')
              .done(function (response) {
                  var msg = "Meta Source to Staging Mapping configuration has been restored to System Default.";
                  UIToastr.notify('success', 'Restored Successfully!', msg);
              });
      });
      $('#show-db-meta-src-stg-btn').on('click', function(){
          var msg = "Meta Source to Staging Mapping Database Name";
          UIToastr.notify('success', 'META_SRC_STG_MAP', msg);
      });


      // Meta CRM Table Key Mapping
        $('#restore-sys-meta-crm-tbl-btn').on('click', function(){
            var client = $('#client').val();
            var code = 'META_SRC_STG_MAP';
            $.get('/vs/configs/restore_system/?client='+client+'&code='+code)
                .done(function (response) {
                    console.log(code);
                    var msg = "Meta Master Table Key Mapping configuration has been restored to System Default.";
                    UIToastr.notify('success', 'Restored Successfully!', msg);
                });
        });

        $('#user-def-meta-crm-tbl-btn').on('click', function(){
            var form = $('#webclientform').serialize();
            var client = $('#client').val();
            $.post('/vs/configs/crmtablekeymapping/?client='+client+'&setDef=true', form)
                .done(function (response) {
                    var msg = "Meta Master Table Key Mapping (User Default Configuration) has been updated.";
                    UIToastr.notify('success', 'Saved Successfully!', msg);
                });
        });

        $('#restore-user-def-meta-crm-tbl-btn').on('click', function(){
            var client = $('#client').val();
            var code = 'META_SRC_STG_MAP';
            $.get('/vs/configs/crmtablekeymapping/?client='+client+'&code='+code+'&userDef=true')
                .done(function (response) {
                    var msg = "Meta Master Table Key Mapping configuration has been restored to System Default.";
                    UIToastr.notify('success', 'Restored Successfully!', msg);
                });
        });
        $('#show-db-meta-crm-tbl-btn').on('click', function(){
            var msg = "Meta Master Table Key Mapping Database Name";
            UIToastr.notify('success', 'META_SRC_STG_MAP', msg);
        });

        // CRM Unstructured Object
        $('#restore-sys-meta-crm-ustrc-btn').on('click', function(){
              var client = $('#client').val();
              var code = 'CRM_UNSTRUCTURED_OBJECT_LOOKUP';
              $.get('/vs/configs/restore_system/?client='+client+'&code='+code)
                  .done(function (response) {
                      console.log(code);
                      var msg = "Meta Master Unstructured Object Setup configuration has been restored to System Default.";
                      UIToastr.notify('success', 'Restored Successfully!', msg);
                  });
          });

          $('#user-def-meta-crm-ustrc-btn').on('click', function(){
              var form = $('#webclientform').serialize();
              var client = $('#client').val();
              $.post('/vs/configs/crmunstructuredobj/?client='+client+'&setDef=true', form)
                  .done(function (response) {
                      var msg = "Meta Master Unstructured Object Setup (User Default Configuration) has been updated.";
                      UIToastr.notify('success', 'Saved Successfully!', msg);
                  });
          });

          $('#restore-user-def-meta-crm-ustrc-btn').on('click', function(){
              var client = $('#client').val();
              var code = 'CRM_UNSTRUCTURED_OBJECT_LOOKUP';
              $.get('/vs/configs/crmunstructuredobj/?client='+client+'&code='+code+'&userDef=true')
                  .done(function (response) {
                      var msg = "Meta Master Unstructured Object Setup configuration has been restored to System Default.";
                      UIToastr.notify('success', 'Restored Successfully!', msg);
                  });
          });
          $('#show-db-meta-crm-ustrc-btn').on('click', function(){
              var msg = "Meta Master Unstructured Object Setup Database Name";
              UIToastr.notify('success', 'CRM_UNSTRUCTURED_OBJECT_LOOKUP', msg);
          });

          // Meta DS Conn
          $('#restore-sys-meta-dsconn-btn').on('click', function(){
                var client = $('#client').val();
                var code = 'META_DS_CONN_TABLE';
                $.get('/vs/configs/restore_system/?client='+client+'&code='+code)
                    .done(function (response) {
                        console.log(code);
                        var msg = "Meta Data Source Connection Setup configuration has been restored to System Default.";
                        UIToastr.notify('success', 'Restored Successfully!', msg);
                    });
            });

            $('#user-def-meta-dsconn-btn').on('click', function(){
                var form = $('#webclientform').serialize();
                var client = $('#client').val();
                $.post('/vs/configs/metadsconn/?client='+client+'&setDef=true', form)
                    .done(function (response) {
                        var msg = "Meta Data Source Connection Setup (User Default Configuration) has been updated.";
                        UIToastr.notify('success', 'Saved Successfully!', msg);
                    });
            });

            $('#restore-user-def-meta-dsconn-btn').on('click', function(){
                var client = $('#client').val();
                var code = 'META_DS_CONN_TABLE';
                $.get('/vs/configs/metadsconn/?client='+client+'&code='+code+'&userDef=true')
                    .done(function (response) {
                        var msg = "Meta Data Source Connection Setup configuration has been restored to System Default.";
                        UIToastr.notify('success', 'Restored Successfully!', msg);
                    });
            });
            $('#show-db-meta-dsconn-btn').on('click', function(){
                var msg = "Meta Data Source Connection Setup Database Name";
                UIToastr.notify('success', 'META_DS_CONN_TABLE', msg);
            });


            // Feature sub type
            $('#restore-sys-meta-ftr-stype-btn').on('click', function(){
                  var client = $('#client').val();
                  var code = 'feature_subtype_lookup';
                  $.get('/vs/configs/restore_system/?client='+client+'&code='+code)
                      .done(function (response) {
                          console.log(code);
                          var msg = "Feature Sub Type configuration has been restored to System Default.";
                          UIToastr.notify('success', 'Restored Successfully!', msg);
                      });
              });

              $('#user-def-meta-ftr-stype-btn').on('click', function(){
                  var form = $('#webclientform').serialize();
                  var client = $('#client').val();
                  $.post('/vs/configs/featuresubtype/?client='+client+'&setDef=true', form)
                      .done(function (response) {
                          var msg = "Feature Sub Type (User Default Configuration) has been updated.";
                          UIToastr.notify('success', 'Saved Successfully!', msg);
                      });
              });

              $('#restore-user-def-meta-ftr-stype-btn').on('click', function(){
                  var client = $('#client').val();
                  var code = 'feature_subtype_lookup';
                  $.get('/vs/configs/featuresubtype/?client='+client+'&code='+code+'&userDef=true')
                      .done(function (response) {
                          var msg = "Feature Sub Type configuration has been restored to System Default.";
                          UIToastr.notify('success', 'Restored Successfully!', msg);
                      });
              });
              $('#show-db-meta-ftr-stype-btn').on('click', function(){
                  var msg = "Feature Sub Type Database Name";
                  UIToastr.notify('success', 'feature_subtype_lookup', msg);
              });

              // Meta Data Source Categories
              $('#restore-sys-meta-dsconn-btn').on('click', function(){
                    var client = $('#client').val();
                    var code = 'DATASOURCE_CATEGORY_LOOKUP';
                    $.get('/vs/configs/restore_system/?client='+client+'&code='+code)
                        .done(function (response) {
                            console.log(code);
                            var msg = "Meta Data Source Categories configuration has been restored to System Default.";
                            UIToastr.notify('success', 'Restored Successfully!', msg);
                        });
                });

                $('#user-def-meta-dsconn-btn').on('click', function(){
                    var form = $('#webclientform').serialize();
                    var client = $('#client').val();
                    $.post('/vs/configs/dslookup/?client='+client+'&setDef=true', form)
                        .done(function (response) {
                            var msg = "Meta Data Source Categories (User Default Configuration) has been updated.";
                            UIToastr.notify('success', 'Saved Successfully!', msg);
                        });
                });

                $('#restore-user-def-meta-dsconn-btn').on('click', function(){
                    var client = $('#client').val();
                    var code = 'DATASOURCE_CATEGORY_LOOKUP';
                    $.get('/vs/configs/dslookup/?client='+client+'&code='+code+'&userDef=true')
                        .done(function (response) {
                            var msg = "Meta Data Source Categories configuration has been restored to System Default.";
                            UIToastr.notify('success', 'Restored Successfully!', msg);
                        });
                });
                $('#show-db-meta-dsconn-btn').on('click', function(){
                    var msg = "Meta Data Source Categories Database Name";
                    UIToastr.notify('success', 'DATASOURCE_CATEGORY_LOOKUP', msg);
                });


                // Feature type
                $('#restore-sys-meta-ftr-type-btn').on('click', function(){
                      var client = $('#client').val();
                      var code = 'feature_type_lookup';
                      $.get('/vs/configs/restore_system/?client='+client+'&code='+code)
                          .done(function (response) {
                              console.log(code);
                              var msg = "Feature Type configuration has been restored to System Default.";
                              UIToastr.notify('success', 'Restored Successfully!', msg);
                          });
                  });

                  $('#user-def-meta-ftr-type-btn').on('click', function(){
                      var form = $('#webclientform').serialize();
                      var client = $('#client').val();
                      $.post('/vs/configs/featuretype/?client='+client+'&setDef=true', form)
                          .done(function (response) {
                              var msg = "Feature Type (User Default Configuration) has been updated.";
                              UIToastr.notify('success', 'Saved Successfully!', msg);
                          });
                  });

                  $('#restore-user-def-meta-ftr-type-btn').on('click', function(){
                      var client = $('#client').val();
                      var code = 'feature_type_lookup';
                      $.get('/vs/configs/featuretype/?client='+client+'&code='+code+'&userDef=true')
                          .done(function (response) {
                              var msg = "Feature Type configuration has been restored to System Default.";
                              UIToastr.notify('success', 'Restored Successfully!', msg);
                          });
                  });
                  $('#show-db-meta-ftr-type-btn').on('click', function(){
                      var msg = "Feature Type Database Name";
                      UIToastr.notify('success', 'feature_type_lookup', msg);
                  });
});
